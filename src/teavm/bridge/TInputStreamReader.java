package org.teavm.classlib.java.io;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
public class TInputStreamReader extends Reader {
    private final InputStream in;
    public TInputStreamReader(InputStream in) { this.in = in; }
    @Override public int read(char[] cbuf, int off, int len) throws IOException {
        if (len == 0) return 0;
        int n = in.read();
        if (n < 0) return -1;
        cbuf[off] = (char) (n & 0xff);
        return 1;
    }
    @Override public void close() {}
}
