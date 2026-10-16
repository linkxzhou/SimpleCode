import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { formatMB, languageAssetIds, languageSize, loadManifest, type LanguageSpec, type Manifest } from "@/core/manifest";
import { LinuxKilled, bootLinux, linuxMachine } from "@/core/linux";
import { clearRustCache, ensureRustToolchain, rustCacheBytes, rustDownloadBytes, rustIsCached, rustReady } from "@/rustc/toolchain";
import { cacheUsage, clearCache as clearWasmCache, ensureAsset, getLoaded, isCached, pruneCache } from "@/core/wasmLoader";
import { terminal } from "@/core/terminal";

export type LangStatus = "idle" | "cached" | "downloading" | "ready" | "error";

export interface LangState {
  status: LangStatus;
  loaded: number;
  total: number;
  error?: string;
  /** "boot" while the Linux guest is restoring its snapshot. */
  detail?: "download" | "boot";
}

const SELECTED_KEY = "simplecode:language";

export const useLanguageStore = defineStore("language", () => {
  const manifest = ref<Manifest>();
  const manifestError = ref<string>();
  const selectedId = ref<string>(localStorage.getItem(SELECTED_KEY) || "python");
  const states = reactive<Record<string, LangState>>({});
  const usage = ref(0);
  const selectionOrigin = ref<"user" | "doc">("user");
  const controllers = new Map<string, AbortController>();
  const pending = new Map<string, Promise<boolean>>();

  const languages = computed(() => manifest.value?.languages ?? []);
  const selected = computed(() => languages.value.find((l) => l.id === selectedId.value));
  const selectedState = computed(() => (selectedId.value ? states[selectedId.value] : undefined));

  function sizeOf(lang: LanguageSpec) {
    if (lang.compiler === "weblings") return rustDownloadBytes();
    return manifest.value ? languageSize(manifest.value, lang) : 0;
  }

  async function refreshUsage() {
    usage.value = (await cacheUsage()) + (await rustCacheBytes());
  }

  async function refreshStatuses() {
    const m = manifest.value;
    if (!m) return;
    for (const lang of m.languages) {
      if (!states[lang.id]) states[lang.id] = { status: "idle", loaded: 0, total: sizeOf(lang) };
      const st = states[lang.id]; // re-read through the reactive proxy
      if (st.status === "downloading") continue;
      if (lang.compiler === "weblings") {
        if (rustReady()) st.status = "ready";
        else if (await rustIsCached()) st.status = "cached";
        else if (st.status !== "error") st.status = "idle";
        continue;
      }
      const ids = languageAssetIds(lang);
      if (ids.every((id) => getLoaded(id))) st.status = "ready";
      else if ((await Promise.all(ids.map((id) => isCached(m.assets[id])))).every(Boolean)) st.status = "cached";
      else if (st.status !== "error") st.status = "idle";
    }
  }

  async function init() {
    try {
      manifest.value = await loadManifest();
      manifestError.value = undefined;
    } catch (e) {
      manifestError.value = (e as Error).message;
      return;
    }
    if (!languages.value.some((l) => l.id === selectedId.value)) selectedId.value = languages.value[0]?.id;
    await pruneCache(Object.values(manifest.value.assets)).catch(() => {});
    await refreshStatuses();
    void refreshUsage();
    void navigator.storage?.persist?.().catch(() => {});
    if (selected.value) void ensure(selected.value.id);
  }

  async function select(id: string, origin: "user" | "doc" = "user") {
    const prev = selectedId.value;
    selectionOrigin.value = origin;
    selectedId.value = id;
    localStorage.setItem(SELECTED_KEY, id);
    if (prev === "linux" && id !== "linux") {
      linuxMachine.shutdown();
      terminal.setPassthrough(undefined);
      if (states.linux && states.linux.status === "ready") states.linux.status = "cached";
    }
    return ensure(id);
  }

  function ensure(id: string): Promise<boolean> {
    const existing = pending.get(id);
    if (existing) return existing;
    const p = doEnsure(id).finally(() => pending.delete(id));
    pending.set(id, p);
    return p;
  }

  async function doEnsure(id: string): Promise<boolean> {
    const m = manifest.value;
    const lang = m?.languages.find((l) => l.id === id);
    if (!m || !lang) return false;
    // Sidebar buttons appear as soon as the manifest is assigned, which is
    // before refreshStatuses fills `states`. Selecting in that window must
    // not throw on a missing entry.
    if (!states[id]) states[id] = { status: "idle", loaded: 0, total: sizeOf(lang) };
    const st = states[id];
    if (st.status === "ready") return true;
    if (lang.compiler === "weblings") {
      const fromNetwork = st.status !== "cached" && !rustReady();
      st.status = "downloading";
      st.error = undefined;
      st.total = rustDownloadBytes();
      st.loaded = 0;
      const ctrl = new AbortController();
      controllers.set(id, ctrl);
      if (fromNetwork) terminal.system(`正在下载 ${lang.label} 工具链（${formatMB(st.total)}）…`);
      try {
        await ensureRustToolchain((loaded, total) => {
          st.loaded = loaded;
          st.total = total;
        }, ctrl.signal);
        st.status = "ready";
        st.loaded = st.total;
        if (fromNetwork) terminal.system(`${lang.label} 已就绪（已缓存），按 Ctrl/⌘+Enter 运行`, "32");
        await refreshStatuses();
        void refreshUsage();
        return true;
      } catch (e) {
        const aborted = (e as Error).name === "AbortError";
        st.status = aborted ? "idle" : "error";
        st.error = aborted ? undefined : (e as Error).message;
        terminal.system(aborted ? `已取消下载 ${lang.label}` : `下载 ${lang.label} 失败：${(e as Error).message}`, aborted ? "2" : "31");
        return false;
      } finally {
        controllers.delete(id);
      }
    }
    const ids = languageAssetIds(lang);
    const fromNetwork = st.status !== "cached";
    const progress: Record<string, number> = {};
    st.status = "downloading";
    st.detail = "download";
    st.error = undefined;
    st.total = sizeOf(lang);
    st.loaded = 0;
    const ctrl = new AbortController();
    controllers.set(id, ctrl);
    if (fromNetwork) terminal.system(`正在下载 ${lang.label} 运行时（${formatMB(st.total)}）…`);
    try {
      await Promise.all(
        ids.map((assetId) =>
          ensureAsset(
            assetId,
            m.assets[assetId],
            (loaded) => {
              progress[assetId] = loaded;
              st.loaded = Object.values(progress).reduce((a, b) => a + b, 0);
            },
            ctrl.signal,
          ),
        ),
      );
      if (lang.runtime === "v86") {
        st.detail = "boot";
        terminal.system("正在启动 Linux…");
        await bootLinux();
        terminal.system("Linux 已启动，可以直接输入命令", "32");
      }
      st.detail = undefined;
      st.status = "ready";
      st.loaded = st.total;
      if (fromNetwork && lang.runtime !== "v86") terminal.system(`${lang.label} 已就绪（已缓存），按 Ctrl/⌘+Enter 运行`, "32");
      await refreshStatuses();
      void refreshUsage();
      return true;
    } catch (e) {
      const aborted = (e as Error).name === "AbortError";
      const stopped = e instanceof LinuxKilled;
      const booting = st.detail === "boot";
      st.detail = undefined;
      if (stopped) {
        if (st.status === "downloading") st.status = "cached";
        st.error = undefined;
        return false;
      }
      st.status = aborted ? "idle" : "error";
      st.error = aborted ? undefined : (e as Error).message;
      const action = booting ? "启动" : "下载";
      terminal.system(aborted ? `已取消${action} ${lang.label}` : `${action} ${lang.label} 失败：${(e as Error).message}`, aborted ? "2" : "31");
      return false;
    } finally {
      controllers.delete(id);
    }
  }

  function cancel(id: string) {
    controllers.get(id)?.abort();
  }

  async function clearCache() {
    linuxMachine.shutdown();
    terminal.setPassthrough(undefined);
    await clearWasmCache();
    await clearRustCache();
    for (const s of Object.values(states)) if (s.status !== "downloading") s.status = "idle";
    await refreshUsage();
  }

  return { manifest, manifestError, languages, selectedId, selected, selectedState, states, usage, selectionOrigin, init, select, ensure, cancel, clearCache, sizeOf };
});
