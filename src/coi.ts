const RELOAD_KEY = "simplecode:coi-reload";

export type CoiReloadDecision = "use-page" | "reload" | "show-error";

export function coiUrls(base: string, href: string): { script: string; scope: string } {
  const directory = base.endsWith("/") ? base : `${base}/`;
  const scope = new URL(directory, href);
  const script = new URL("coi-serviceworker.js", scope);
  return { script: script.href, scope: scope.href };
}

/** One reload after the worker activates. A second miss shows the error page. */
export function coiReloadDecision(input: {
  isolated: boolean;
  canRegister: boolean;
  activated: boolean;
  alreadyReloaded: boolean;
}): CoiReloadDecision {
  if (input.isolated) return "use-page";
  if (!input.canRegister || !input.activated || input.alreadyReloaded) return "show-error";
  return "reload";
}

function storageGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): boolean {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function storageRemove(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* storage blocked */
  }
}

function waitActivated(worker: ServiceWorker): Promise<void> {
  if (worker.state === "activated") return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("service worker timeout")), 8000);
    const done = () => {
      if (worker.state === "activated") {
        window.clearTimeout(timer);
        resolve();
      } else if (worker.state === "redundant") {
        window.clearTimeout(timer);
        reject(new Error("service worker redundant"));
      }
    };
    worker.addEventListener("statechange", done);
    done();
  });
}

function halt(): Promise<void> {
  return new Promise(() => {});
}

/** Register before the app mounts. Dev servers that already send COOP/COEP skip this. */
export async function ensureCrossOriginIsolation(): Promise<void> {
  if (typeof window === "undefined") return;
  const canRegister = window.isSecureContext && "serviceWorker" in navigator;
  if (window.crossOriginIsolated) {
    storageRemove(RELOAD_KEY);
    return;
  }
  if (!canRegister) return;

  let activated = false;
  try {
    const { script, scope } = coiUrls(import.meta.env.BASE_URL, window.location.href);
    const registration = await navigator.serviceWorker.register(script, { scope });
    const worker = registration.installing ?? registration.waiting ?? registration.active;
    if (worker) {
      await waitActivated(worker);
      activated = true;
    }
  } catch {
    return;
  }

  const decision = coiReloadDecision({
    isolated: window.crossOriginIsolated,
    canRegister,
    activated,
    alreadyReloaded: storageGet(RELOAD_KEY) === "1",
  });
  if (decision === "use-page") {
    storageRemove(RELOAD_KEY);
    return;
  }
  if (decision !== "reload") return;
  if (!storageSet(RELOAD_KEY, "1")) return;
  window.location.reload();
  await halt();
}
