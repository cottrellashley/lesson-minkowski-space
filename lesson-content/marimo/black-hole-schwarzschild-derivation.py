import marimo

__generated_with = "0.23.10"
app = marimo.App()


@app.cell
def _():
    import marimo as mo
    import numpy as np
    import matplotlib.pyplot as plt

    return mo, np, plt


@app.cell
def _(mo):
    mo.md(r"""
    # Schwarzschild Derivation (Book-Grounded)

    This notebook follows the derivation in:

    **Lecture Notes - Extensive & Advanced**
    - Chapter 24.2 and 24.3
    - Printed pages 498-504
    - PDF pages 499-505

    Page mapping rule used here:
    - printed page = PDF page - 1

    So every equation in this notebook tracks the chapter sequence:
    $(24.1) \rightarrow (24.6) \rightarrow (24.17) \rightarrow (24.25) \rightarrow (24.33)$.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Reading Guide (Exact Pages)

    - Setup and symmetry assumptions: 24.2
      - printed 498-501, PDF 499-502
    - Solving Einstein equations: 24.3
      - printed 501-504, PDF 502-505
    - Coordinate interpretation and radius discussion: 24.4
      - starts at printed 505, PDF 506

    If you want to audit any step, jump directly to those page windows.
    """)
    return


@app.cell
def _(mo):
    detail = mo.ui.radio(
        options=["Equation flow", "Equation + intuition", "Full detail"],
        value="Full detail",
        label="Mode:",
    )
    mo.vstack([detail])
    return (detail,)


@app.cell
def _(detail, mo):
    if detail.value == "Equation flow":
        msg = "Minimal route: equations only, one line of interpretation each."
    elif detail.value == "Equation + intuition":
        msg = "Balanced route: equations with physical interpretation."
    else:
        msg = "Full route: assumptions, coordinate choices, reduced equations, constants, and interpretation."

    mo.md(f"**Selected mode:** {msg}")
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 1) Start from the general static, spherically symmetric ansatz (Eq. 24.1)

    The notes begin with

    $$
    ds^2 = -A(r)dt^2 + B(r)dr^2 + 2C(r)dr\,dt + D(r)r^2(d\theta^2 + \sin^2\theta\,d\phi^2).
    $$

    Then they simplify this ansatz by coordinate redefinitions:
    - remove the cross-term via a new time coordinate (Eqs. 24.2-24.4), so $C(r)=0$
    - absorb $D(r)$ into a new radial coordinate

    yielding the **standard form** (Eq. 24.6):

    $$
    ds^2 = -A(r)dt^2 + B(r)dr^2 + r^2(d\theta^2 + \sin^2\theta\,d\phi^2).
    $$
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 2) Boundary condition from asymptotic flatness (Eq. 24.15)

    The book imposes

    $$
    \lim_{r\to\infty}A(r)=1,\qquad \lim_{r\to\infty}B(r)=1,
    $$

    because far from the source spacetime should approach Minkowski space.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 3) Christoffel symbols used in the derivation (Eq. 24.17)

    For the metric in Eq. (24.6), the non-zero Christoffels listed in the notes are:

    $$
    \Gamma^r_{rr}=\frac{B'}{2B},\quad
    \Gamma^r_{tt}=\frac{A'}{2B},\quad
    \Gamma^r_{\theta\theta}=-\frac{r}{B},\quad
    \Gamma^r_{\phi\phi}=-\frac{r\sin^2\theta}{B},
    $$

    $$
    \Gamma^\theta_{\theta r}=\Gamma^\phi_{\phi r}=\frac{1}{r},\quad
    \Gamma^t_{tr}=\frac{A'}{2A},\quad
    \Gamma^\theta_{\phi\phi}=-\sin\theta\cos\theta,\quad
    \Gamma^\phi_{\phi\theta}=\cot\theta.
    $$

    (Prime means $d/dr$.)
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 4) Ricci components in the notes (Eq. 24.25)

    The reduced Ricci components are

    $$
    R_{tt}=\frac{A''}{2B}-\frac{A'}{4B}\left(\frac{A'}{A}+\frac{B'}{B}\right)+\frac{A'}{rB},
    $$

    $$
    R_{rr}=-\frac{A''}{2A}+\frac{A'}{4A}\left(\frac{A'}{A}+\frac{B'}{B}\right)+\frac{B'}{rB},
    $$

    $$
    R_{\theta\theta}=1-\frac{1}{B}-\frac{r}{2B}\left(\frac{A'}{A}-\frac{B'}{B}\right).
    $$

    In vacuum, set each to zero.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 5) Key linear combination (Eq. 24.26 -> 24.28)

    The notes take

    $$
    B R_{tt} + A R_{rr} = \frac{1}{rB}(A'B+B'A)=0
    $$

    so

    $$
    A'B+B'A=0
    \Rightarrow A(r)B(r)=\text{const}.
    $$

    Asymptotic flatness fixes the constant to 1, therefore

    $$
    B(r)=\frac{1}{A(r)}.
    $$
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 6) Solve with $R_{\theta\theta}=0$ (Eq. 24.29 -> 24.30)

    Substitute $B=1/A$ into $R_{\theta\theta}=0$:

    $$
    A-1+rA'=0
    \iff (Ar)'=1.
    $$

    Integrate:

    $$
    Ar=r+C
    \Rightarrow A(r)=1+\frac{C}{r}.
    $$

    Then $R_{tt}=R_{rr}=0$ also hold.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## 7) Newtonian matching and final metric (Eq. 24.31, 24.33)

    The notes match to the weak-field limit

    $$
    A(r)=-g_{00}\approx 1+\frac{2\Phi}{c^2},\qquad \Phi=-\frac{G_N M}{r},
    $$

    giving

    $$
    C=-\frac{2G_NM}{c^2}.
    $$

    So

    $$
    ds^2 = -\left(1-\frac{2G_NM}{c^2 r}\right)c^2dt^2
    +\left(1-\frac{2G_NM}{c^2 r}\right)^{-1}dr^2
    +r^2d\Omega^2,
    $$

    and with $m=G_NM/c^2$ (Eq. 24.32):

    $$
    ds^2=-f(r)dt^2+f(r)^{-1}dr^2+r^2d\Omega^2,
    \qquad f(r)=1-\frac{2m}{r}.
    $$
    """)
    return


@app.cell
def _(mo):
    M = mo.ui.slider(start=0.5, stop=15.0, step=0.5, value=3.0, label="Mass parameter m = GM/c^2")
    r = mo.ui.slider(start=0.6, stop=60.0, step=0.1, value=12.0, label="Radius r")
    mo.vstack([M, r])
    return M, r


@app.cell
def _(M, mo, r):
    m = M.value
    rr = r.value
    rs = 2 * m
    f = 1 - 2 * m / rr

    if rr > rs:
        region = "outside r = 2m"
    elif abs(rr - rs) < 1e-12:
        region = "exactly at r = 2m"
    else:
        region = "inside r = 2m"

    mo.md(
        f"""
    ### Numeric check against Eq. (24.33)

    - $m = {m:.3f}$
    - $r_s = 2m = {rs:.3f}$
    - $f(r) = 1-2m/r = {f:.6f}$
    - Current point is **{region}**
    """
    )
    return


@app.cell
def _(M, np, plt):
    m = M.value
    rs = 2 * m

    x_min = max(0.2, 0.25 * rs)
    x_max = max(50.0, 8 * rs)
    x = np.linspace(x_min, x_max, 800)
    y = 1 - 2 * m / x

    fig, ax = plt.subplots(figsize=(8.5, 4.8))
    ax.plot(x, y, linewidth=2.2, label=r"$f(r)=1-2m/r$")
    ax.axhline(0, linestyle="--", linewidth=1)
    ax.axvline(rs, linestyle=":", linewidth=2, label=fr"$r_s=2m={rs:.2f}$")
    ax.set_xlabel("r")
    ax.set_ylabel("f(r)")
    ax.set_title("Function f(r) from Eq. (24.33)")
    ax.grid(alpha=0.25)
    ax.legend()
    fig.tight_layout()
    return (fig,)


@app.cell
def _(fig, mo):
    mo.md("### Visual check")
    mo.pyplot(fig)
    return


@app.cell
def _(mo):
    q1 = mo.ui.radio(
        options=[
            "From R_tt = 0 alone",
            "From BR_tt + AR_rr = 0 with asymptotic flatness",
            "From coordinate transformations only",
        ],
        label="Checkpoint 1: Where does AB=1 come from?",
    )

    q2 = mo.ui.radio(
        options=[
            "A(r)=1+C/r from integrating (Ar)'=1",
            "A(r)=1+Cr from integrating A'=C",
            "A(r)=C/r only",
        ],
        label="Checkpoint 2: What is the intermediate A(r) form before Newtonian matching?",
    )

    mo.vstack([q1, q2])
    return q1, q2


@app.cell
def _(mo, q1, q2):
    a1 = (
        "Correct. That is exactly Eq. (24.26) -> (24.27) plus asymptotic condition (24.15)."
        if q1.value == "From BR_tt + AR_rr = 0 with asymptotic flatness"
        else "Not quite. The notes use BR_tt + AR_rr first, then asymptotic flatness."
    )

    a2 = (
        "Correct. This is Eq. (24.30) before fixing C with the Newtonian limit."
        if q2.value == "A(r)=1+C/r from integrating (Ar)'=1"
        else "Not quite. The step in the notes is (Ar)'=1 -> Ar=r+C -> A=1+C/r."
    )

    mo.md(f"""
    ### Feedback

    - Q1: {a1}
    - Q2: {a2}
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Final one-screen summary (book sequence)

    1. Start with Eq. (24.1), simplify to Eq. (24.6).
    2. Compute Christoffels (Eq. 24.17).
    3. Use Ricci components (Eq. 24.25).
    4. Combine equations: Eq. (24.26) -> $AB=\mathrm{const}$ -> Eq. (24.28).
    5. Use $R_{\theta\theta}=0$: Eq. (24.29) -> Eq. (24.30).
    6. Newtonian matching gives $C=-2G_NM/c^2$.
    7. Arrive at Schwarzschild metric Eq. (24.31), or Eq. (24.33) with $m=G_NM/c^2$.

    This is exactly the derivation path in chapter 24.3.
    """)
    return


if __name__ == "__main__":
    app.run()
