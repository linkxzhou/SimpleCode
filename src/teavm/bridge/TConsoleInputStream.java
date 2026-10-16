package org.teavm.classlib.java.lang;
import java.io.IOException;
import java.io.InputStream;
import org.teavm.interop.Import;
public class TConsoleInputStream extends InputStream {
    @Import(name = "read", module = "simplecode")
    private static native int readByte();
    @Override public int read() throws IOException { return readByte(); }
    @Override public int read(byte[] b, int off, int len) throws IOException {
        if (len == 0) return 0;
        int n = read();
        if (n < 0) return -1;
        b[off] = (byte) n;
        return 1;
    }
}
