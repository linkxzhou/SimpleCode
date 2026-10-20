import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src" / "pyodide"))
import minitorch as mt
from minitorch import Tensor, cross_entropy


def check(name, got, want, tol=1e-6):
    got = np.asarray(got, dtype=np.float64)
    want = np.asarray(want, dtype=np.float64)
    if got.shape != want.shape or np.max(np.abs(got - want)) > tol:
        raise SystemExit(f"{name} got {got} want {want}")


def test_square():
    x = Tensor([1.0, 2.0, 3.0], requires_grad=True)
    loss = (x * x).sum()
    loss.backward()
    check("square", x.grad, [2.0, 4.0, 6.0])


def test_bias_broadcast():
    x = Tensor([[1.0, 2.0], [3.0, 4.0]], requires_grad=True)
    bias = Tensor([0.5, -1.0], requires_grad=True)
    loss = (x + bias).sum()
    loss.backward()
    check("x", x.grad, [[1.0, 1.0], [1.0, 1.0]])
    check("bias", bias.grad, [2.0, 2.0])


def test_linear_finite():
    np.random.seed(1)
    layer = mt.nn.Linear(3, 2)
    x = Tensor(np.random.randn(4, 3))
    y = layer(x).sum()
    y.backward()
    weight = layer.weight.data.copy()
    analytic = layer.weight.grad.copy()
    eps = 1e-5
    numeric = np.zeros_like(weight)
    for index in np.ndindex(weight.shape):
        layer.weight.data[index] = weight[index] + eps
        plus = layer(x).data.sum()
        layer.weight.data[index] = weight[index] - eps
        minus = layer(x).data.sum()
        layer.weight.data[index] = weight[index]
        numeric[index] = (plus - minus) / (2 * eps)
    check("linear weight", analytic, numeric, tol=1e-4)


def test_cross_entropy():
    logits = Tensor([[2.0, 0.5, -1.0], [0.0, 0.2, 0.3]], requires_grad=True)
    loss = cross_entropy(logits, [0, 2])
    loss.backward()
    base = logits.data.copy()
    analytic = logits.grad.copy()
    eps = 1e-5
    numeric = np.zeros_like(base)
    for index in np.ndindex(base.shape):
        logits.data[index] = base[index] + eps
        plus = cross_entropy(logits, [0, 2]).data
        logits.data[index] = base[index] - eps
        minus = cross_entropy(logits, [0, 2]).data
        logits.data[index] = base[index]
        numeric[index] = (plus - minus) / (2 * eps)
    check("cross entropy", analytic, numeric, tol=1e-4)


def test_xor():
    np.random.seed(0)
    model = mt.nn.Sequential(mt.nn.Linear(2, 8), mt.nn.ReLU(), mt.nn.Linear(8, 2))
    opt = mt.optim.SGD(model.parameters(), lr=0.4)
    x = Tensor([[0, 0], [0, 1], [1, 0], [1, 1]])
    y = np.array([0, 1, 1, 0])
    last = 1.0
    for _ in range(200):
        opt.zero_grad()
        logits = model(x)
        loss = cross_entropy(logits, y)
        loss.backward()
        opt.step()
        last = float(loss.data)
    pred = model(x).data.argmax(axis=1)
    if list(map(int, pred)) != [0, 1, 1, 0]:
        raise SystemExit(f"xor pred {pred} loss {last}")
    print(f"xor loss {last:.4f}")


def test_fashion_steps():
    path = Path(__file__).resolve().parents[1] / "wasm" / "pyodide" / "fashion-mnist.bin"
    x, y, xt, yt = mt.datasets.fashion_mnist(256, 64, path=str(path))
    if x.shape != (256, 784) or yt.shape != (64,):
        raise SystemExit(f"fashion shape {x.shape} {yt.shape}")
    np.random.seed(2)
    model = mt.nn.Sequential(mt.nn.Linear(784, 16), mt.nn.ReLU(), mt.nn.Linear(16, 10))
    opt = mt.optim.Adam(model.parameters(), lr=0.01)
    opt.zero_grad()
    loss = cross_entropy(model(Tensor(x[:32])), y[:32])
    loss.backward()
    opt.step()
    logits = model(Tensor(xt))
    acc = float((logits.data.argmax(axis=1) == yt).mean())
    print(f"loss {float(loss.data):.4f}")
    print(f"acc {acc:.3f}")


if __name__ == "__main__":
    test_square()
    test_bias_broadcast()
    test_linear_finite()
    test_cross_entropy()
    test_xor()
    test_fashion_steps()
    print("minitorch ok")
