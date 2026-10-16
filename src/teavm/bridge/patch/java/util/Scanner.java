package java.util;

import java.io.InputStream;
import java.util.NoSuchElementException;

public class Scanner {
    private final InputStream in;
    private int ahead = -2;

    public Scanner(InputStream in) {
        this.in = in;
    }

    private int peek() {
        try {
            if (ahead == -2) {
                ahead = in.read();
            }
            return ahead;
        } catch (Exception e) {
            return -1;
        }
    }

    private int take() {
        int c = peek();
        ahead = -2;
        return c;
    }

    private void skipWs() {
        while (true) {
            int c = peek();
            if (c != ' ' && c != '\t' && c != '\n' && c != '\r') {
                return;
            }
            take();
        }
    }

    public boolean hasNext() {
        skipWs();
        return peek() != -1;
    }

    public boolean hasNextLine() {
        return peek() != -1;
    }

    public boolean hasNextInt() {
        skipWs();
        int c = peek();
        return c == '-' || (c >= '0' && c <= '9');
    }

    public String next() {
        skipWs();
        if (peek() == -1) {
            throw new NoSuchElementException();
        }
        StringBuilder sb = new StringBuilder();
        while (true) {
            int c = peek();
            if (c == -1 || c == ' ' || c == '\t' || c == '\n' || c == '\r') {
                break;
            }
            sb.append((char) take());
        }
        return sb.toString();
    }

    public int nextInt() {
        return Integer.parseInt(next());
    }

    public String nextLine() {
        if (peek() == -1) {
            throw new NoSuchElementException();
        }
        StringBuilder sb = new StringBuilder();
        while (true) {
            int c = take();
            if (c == -1 || c == '\n') {
                break;
            }
            if (c == '\r') {
                if (peek() == '\n') {
                    take();
                }
                break;
            }
            sb.append((char) c);
        }
        return sb.toString();
    }

    public void close() {
    }
}
