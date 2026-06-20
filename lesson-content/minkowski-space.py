import marimo

__generated_with = "0.23.10"
app = marimo.App()


@app.cell
def _():
    import marimo as mo
    import numpy as np
    import matplotlib.pyplot as plt
    from matplotlib.patches import FancyArrowPatch
    import sympy as sp
    from sympy import symbols, sqrt, simplify, latex


    return mo, np, plt


@app.cell
def _(mo):
    mo.md("""
    # 🌌 Minkowski Spacetime: An Interactive Journey

    Welcome to the geometric heart of special relativity!

    This lesson is designed to build your *intuition* for spacetime before we work with equations.
    By the end, you'll understand:

    - Why light speed is the speed limit
    - How time and space are interwoven
    - Why moving clocks run slow (from geometry!)
    - How simultaneity is relative

    **Start here:** What's your background with special relativity?
    """)
    return


@app.cell
def _(mo):
    experience = mo.ui.radio(
        options=["Never heard of it!", "Heard of it but confused", "Familiar with equations", "Already comfortable"],
        label="Your relativity experience:"
    )
    return (experience,)


@app.cell
def _(experience, mo):
    if experience.value == "Never heard of it!":
        message = "Perfect! We'll build intuition from scratch with visualizations."
    elif experience.value == "Heard of it but confused":
        message = "Great—we'll clarify the geometric picture that makes it all make sense."
    elif experience.value == "Familiar with equations":
        message = "Excellent! We'll connect the math to the geometry behind it."
    else:
        message = "Wonderful! Let's deepen your geometric understanding."

    mo.md(f"**Your path:** {message}")
    return


@app.cell
def _(mo):
    mo.md("""
    ## Part 1: Why Relativity?

    Imagine you're on a train throwing a ball forward. You throw at 10 m/s.
    Someone outside sees the ball at (train speed + 10 m/s).

    **This is Galilean relativity—velocities add.**

    But light is weird. A light beam travels at 300,000 km/s in all frames.
    - If YOU'RE moving at 0.9c and shine a light forward...
    - The light still travels at c (not 1.9c!)

    This destroys classical physics. So Einstein asked: *What's different about spacetime?*
    """)
    return


@app.cell
def _(mo):
    mo.md("## Interactive: Lorentz Velocity Addition")

    velocity = mo.ui.slider(
        label="Observer velocity (fraction of c):",
        start=0.0,
        stop=0.95,
        step=0.05,
        value=0.6
    )

    light_label = mo.ui.slider(
        label="Light beam (always c):",
        start=0.999,
        stop=1.0,
        step=0.001,
        value=1.0
    )

    mo.vstack([velocity, light_label])
    return (velocity,)


@app.cell
def _(mo, velocity):
    mo.md(f"""
    **You're moving at {velocity.value:.1%} of light speed.**

    Galilean addition would give: {velocity.value:.1%} + 100% = {(velocity.value + 1.0):.1%}

    But relativistic addition gives us... let me calculate:
    """)
    return


@app.cell
def _(mo, velocity):
    # Lorentz velocity addition formula
    v = velocity.value  # observer velocity
    u_prime = 1.0  # light beam in observer frame

    # v_final = (v + u_prime) / (1 + v*u_prime/c²), with c=1
    v_final = (v + u_prime) / (1 + v * u_prime)

    mo.md(f"""
    **Relativistic addition:** 
    $$ v_{{final}} = \\frac{{v + u'}}{{1 + v u'/c^2}} = \\frac{{{v:.2f} + 1.0}}{{1 + {v:.2f} \\cdot 1.0}} = {v_final:.4f}c $$

    **Still c!** No matter the observer's speed, light travels at c. This is Einstein's first postulate.

    > The speed of light is the same in all inertial reference frames.
    """)
    return


@app.cell
def _(mo):
    mo.md("""
    ## Part 2: Spacetime Diagrams (The Foundation)

    Einstein's insight was geometric. He realized that space and time aren't separate—
    they're woven into a single fabric: **spacetime**.

    **Minkowski diagrams** are how we visualize this:
    - **Horizontal axis (x):** Space
    - **Vertical axis (t):** Time
    - **45° line:** Path of a light beam (c = 1 in our units)
    - **Vertical line:** Stationary observer
    - **Tilted line:** Moving observer
    """)
    return


@app.cell
def _(mo, np, plt):
    fig, ax = plt.subplots(figsize=(8, 8))

    # Draw axes
    ax.axhline(y=0, color='k', linewidth=0.5)
    ax.axvline(x=0, color='k', linewidth=0.5)
    ax.set_xlim(-5, 5)
    ax.set_ylim(-1, 5)

    # Light cones (45 degree lines)
    x_light = np.linspace(-5, 5, 100)
    ax.plot(x_light, np.abs(x_light), 'r--', linewidth=2, label='Light cone (c=1)', alpha=0.7)
    ax.plot(x_light, -np.abs(x_light), 'r--', linewidth=2, alpha=0.7)

    # Stationary observer (vertical worldline)
    ax.plot([0, 0], [-1, 5], 'b-', linewidth=3, label='Stationary observer')

    # Moving observer (0.6c)
    v = 0.6
    t_max = 5
    x_max = v * t_max
    ax.plot([-x_max, x_max], [-t_max, t_max], 'g-', linewidth=3, label=f'Moving observer (v={v}c)')

    # Mark an event
    event_x, event_t = 2, 3
    ax.plot(event_x, event_t, 'ko', markersize=10, label='An event')
    ax.text(event_x + 0.2, event_t + 0.2, 'Event: (x, t)', fontsize=11)

    ax.set_xlabel('Position x', fontsize=12)
    ax.set_ylabel('Time t', fontsize=12)
    ax.set_title('Minkowski Spacetime Diagram', fontsize=14, fontweight='bold')
    ax.legend(loc='upper left', fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_aspect('equal')

    mo.md("### Minkowski Diagram: The Canvas of Reality")
    mo.plot(fig)

    mo.md("""
    **What you're seeing:**
    - **Blue line (vertical):** A stationary observer's worldline (path through spacetime)
    - **Green line (tilted):** A moving observer traveling at 0.6c
    - **Red dashed lines:** Light rays (always at 45°)
    - **Black dot:** An event (something that happens at a point in spacetime)

    **Key insight:** Everyone's worldline must stay *inside* the light cone. 
    Nothing can travel faster than light, so no worldline can be steeper than 45°.
    """)
    return


@app.cell
def _(mo):
    mo.md("""
    ## Part 3: Time Dilation (From Geometry!)

    Now here's the magic: we can *see* time dilation in the diagram.

    Imagine two events on a moving observer's worldline:
    - They mark 1 second on their clock (proper time)
    - But this 1 second looks *stretched* when viewed by the stationary observer!
    """)
    return


@app.cell
def _(mo):
    velocity_dilation = mo.ui.slider(
        label="Observer velocity (fraction of c):",
        start=0.0,
        stop=0.95,
        step=0.05,
        value=0.6
    )
    velocity_dilation
    return (velocity_dilation,)


@app.cell
def _(mo, velocity_dilation):
    mo.md(f"""
    **Velocity: {velocity_dilation.value:.1%}c**
    """)
    return


@app.cell
def _(mo, np, plt, velocity_dilation):
    import matplotlib.patches as patches

    fig, ax = plt.subplots(figsize=(10, 8))

    v = velocity_dilation.value
    gamma = 1 / np.sqrt(1 - v**2)

    # Draw axes
    ax.axhline(y=0, color='k', linewidth=0.5)
    ax.axvline(x=0, color='k', linewidth=0.5)
    ax.set_xlim(-3, 3)
    ax.set_ylim(0, 4)

    # Light cone
    x_light = np.linspace(-3, 3, 100)
    ax.plot(x_light, np.abs(x_light), 'r--', linewidth=1.5, alpha=0.5)

    # Stationary observer (vertical)
    ax.plot([0, 0], [0, 4], 'b-', linewidth=2.5, label='Stationary observer')

    # Moving observer (tilted line with slope 1/v)
    if v > 0:
        t_max = 3
        x_max = v * t_max
        ax.plot([0, x_max], [0, t_max], 'g-', linewidth=2.5, label=f'Moving observer (v={v}c)')

        # Mark events: two points separated by proper time (vertical in moving frame)
        # In moving frame, they're at same x but different t
        # Project back to stationary frame
        tau = 1.0  # proper time (moving observer's clock reads 1 second)

        # Event 1
        x1, t1 = 0, 0

        # Event 2: moving observer measures tau seconds later
        # In their frame: (x', 0), (x', tau)
        # Transform back: need to use inverse Lorentz
        # For moving frame events at same x': 
        # t2 = gamma * tau (time dilation!)
        t2 = gamma * tau
        x2 = v * t2

        ax.plot(x1, t1, 'ko', markersize=8)
        ax.plot(x2, t2, 'ko', markersize=8)
        ax.plot([x1, x2], [t1, t2], 'g-', linewidth=3, alpha=0.7)

        # Draw time intervals
        ax.plot([0, 0], [t1, t2], 'b-', linewidth=4, alpha=0.5, label=f'Stationary sees: {t2:.2f}s')
        ax.plot([x1, x1], [t1, t2], 'g--', linewidth=2, alpha=0.7, label=f'Moving clock: {tau}s (proper time)')

        # Annotations
        ax.text(0.1, t2/2, f'Δt = {t2:.2f}s', fontsize=11, ha='left')
        ax.text(-0.5, t2 + 0.1, f'γ = {gamma:.2f}', fontsize=12, 
                bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

    ax.set_xlabel('Position x (light-seconds)', fontsize=12)
    ax.set_ylabel('Time t (seconds)', fontsize=12)
    ax.set_title('Time Dilation: The Moving Clock Runs Slow!', fontsize=14, fontweight='bold')
    ax.legend(loc='upper left', fontsize=11)
    ax.grid(True, alpha=0.3)
    ax.set_aspect('equal')

    mo.plot(fig)
    return (gamma,)


@app.cell
def _(gamma, mo, velocity_dilation):
    v = velocity_dilation.value

    mo.md(f"""
    ### What's Happening?

    - **Green line:** The moving observer's worldline
    - **Green points:** Two events on the moving observer's clock (1 second apart)
    - **Blue arrow:** How much time passes for the stationary observer

    **The magic:** Because the moving observer's worldline is *tilted*, 
    the same "1 second" on their clock corresponds to **{gamma:.2f} seconds** for the stationary observer!

    This isn't because the clock is broken—it's because time itself passes at different rates in different frames.

    **Formula:** $$ \\Delta t = \\gamma \\cdot \\Delta t_0 = \\frac{{\\Delta t_0}}{{\\sqrt{{1 - v^2/c^2}}}} $$

    Where:
    - $\\Delta t_0$ = proper time (moving observer's clock)
    - $\\Delta t$ = coordinate time (stationary observer measures)
    - $\\gamma = 1/\\sqrt{{1 - v^2/c^2}}$ = Lorentz factor

    At v = {v:.1%}c: γ = {gamma:.2f}, so the moving clock runs **{(1/gamma)*100:.1f}% as fast**
    """)
    return


@app.cell
def _(mo):
    mo.md("""
    ## Part 4: Length Contraction (Also From Geometry!)

    Just as time dilates, length contracts. Let me show you why geometrically.
    """)

    velocity_contraction = mo.ui.slider(
        label="Observer velocity (fraction of c):",
        start=0.0,
        stop=0.95,
        step=0.05,
        value=0.6
    )
    velocity_contraction
    return (velocity_contraction,)


@app.cell
def _(mo, velocity_contraction):
    mo.md(f"""
    **Velocity: {velocity_contraction.value:.1%}c**
    """)
    return


@app.cell
def _(mo, np, plt, velocity_contraction):
    fig, ax = plt.subplots(figsize=(10, 8))

    v = velocity_contraction.value
    gamma = 1 / np.sqrt(1 - v**2) if v < 1 else 1

    # Draw axes
    ax.axhline(y=0, color='k', linewidth=0.5)
    ax.axvline(x=0, color='k', linewidth=0.5)
    ax.set_xlim(-2, 4)
    ax.set_ylim(-0.5, 3)

    # A rod at rest in the stationary frame, from x=0 to x=2
    rod_rest = 2.0
    ax.plot([0, rod_rest], [0.5, 0.5], 'b-', linewidth=6, label=f'Rod at rest: L = {rod_rest}', alpha=0.7)
    ax.text(1, 0.7, f'L₀ = {rod_rest}', fontsize=11, ha='center')

    # Same rod moving (appears contracted in x-direction)
    rod_moving = rod_rest / gamma
    ax.plot([0, rod_moving], [1.5, 1.5], 'g-', linewidth=6, label=f'Moving rod: L = {rod_moving:.2f}', alpha=0.7)
    ax.text(rod_moving/2, 1.7, f'L = {rod_moving:.2f}', fontsize=11, ha='center')

    # Arrows showing contraction
    ax.annotate('', xy=(rod_moving, 1.2), xytext=(rod_rest, 1.2),
                arrowprops=dict(arrowstyle='<->', color='red', lw=2))
    ax.text((rod_rest + rod_moving)/2, 1.05, f'Contracted by {(1 - rod_moving/rod_rest)*100:.1f}%', 
            fontsize=10, ha='center', color='red', fontweight='bold')

    # Minkowski diagram showing worldlines of rod ends
    ax.plot([0, 0], [0, 3], 'b--', linewidth=1, alpha=0.5, label='Rod front (at rest)')
    ax.plot([rod_rest, rod_rest], [0, 3], 'b--', linewidth=1, alpha=0.5, label='Rod back (at rest)')

    if v > 0:
        # Moving rod worldlines
        ax.plot([0, 3*v], [0, 3], 'g--', linewidth=1, alpha=0.5, label='Rod front (moving)')
        ax.plot([rod_moving, rod_moving + 3*v], [0, 3], 'g--', linewidth=1, alpha=0.5, label='Rod back (moving)')

    ax.set_xlabel('Position x', fontsize=12)
    ax.set_ylabel('Time t', fontsize=12)
    ax.set_title('Length Contraction: Moving Objects Shrink!', fontsize=14, fontweight='bold')
    ax.legend(loc='upper right', fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_aspect('equal')

    mo.plot(fig)
    return (gamma,)


@app.cell
def _(mo, np, velocity_contraction):
    v = velocity_contraction.value
    gamma = 1 / np.sqrt(1 - v**2) if v < 1 else 1

    mo.md(f"""
    ### What's Happening?

    - **Blue:** A rod at rest (length 2 units)
    - **Green:** The same rod moving at {v:.1%}c (length {2/gamma:.2f} units)

    **The contraction:** Moving objects are squeezed in the direction of motion.

    **Formula:** $$ L = L_0 \\sqrt{{1 - v^2/c^2}} = \\frac{{L_0}}{{\\gamma}} $$

    At v = {v:.1%}c: The rod shrinks to **{(1/gamma)*100:.1f}% of its original length**

    **Key:** This is real! An observer on the moving rod doesn't feel squeezed 
    (they measure it to be length 2), but we measure it to be shorter.
    This is *not* an illusion—it's how spacetime geometry works.
    """)
    return (gamma,)


@app.cell
def _(mo):
    mo.md("""
    ## Part 5: Relativity of Simultaneity (The Deep One!)

    Einstein's most profound insight: there is no universal "now."

    What's simultaneous in one frame is *not* simultaneous in another frame!
    """)
    return


@app.cell
def _(mo):
    velocity_sim = mo.ui.slider(
        label="Observer velocity (fraction of c):",
        start=0.1,
        stop=0.95,
        step=0.05,
        value=0.6
    )
    velocity_sim
    return (velocity_sim,)


@app.cell
def _(mo, velocity_sim):
    mo.md(f"""
    **Velocity: {velocity_sim.value:.1%}c**
    """)
    return


@app.cell
def _(mo, np, plt, velocity_sim):
    fig, ax = plt.subplots(figsize=(10, 8))

    v = velocity_sim.value

    # Draw axes
    ax.axhline(y=0, color='k', linewidth=0.5)
    ax.axvline(x=0, color='k', linewidth=0.5)
    ax.set_xlim(-3, 3)
    ax.set_ylim(-1, 4)

    # Light cone
    x_light = np.linspace(-3, 3, 100)
    ax.plot(x_light, np.abs(x_light), 'r--', linewidth=1, alpha=0.3)

    # Stationary frame: two simultaneous events at t=1
    ax.plot([-2, 2], [1, 1], 'b-', linewidth=2, label='Simultaneous in stationary frame')
    ax.plot(-2, 1, 'bo', markersize=10)
    ax.plot(2, 1, 'bo', markersize=10)
    ax.text(-2, 1.3, 'Event A', fontsize=11, ha='center')
    ax.text(2, 1.3, 'Event B', fontsize=11, ha='center')

    # Moving frame: lines of simultaneity (perpendicular to worldline in spacetime)
    # Worldline has slope 1/v in (x,t) diagram
    # Lines of constant time in moving frame have slope v (perpendicular in spacetime metric)
    slope_sim = v

    # Line of simultaneity through event A at (-2, 1)
    x_range = np.linspace(-3, 3, 100)
    y_sim_A = 1 + slope_sim * (x_range - (-2))
    y_sim_B_at_origin = 0 + slope_sim * (x_range - 0)

    ax.plot(x_range, y_sim_A, 'g--', linewidth=2, label="Simultaneous in moving frame", alpha=0.7)

    # Find where this line intersects with event B
    # Event B is at (2, y_B) where y_B is on the moving frame's simultaneity line through event A
    y_B_on_line = 1 + slope_sim * (2 - (-2))
    ax.plot(2, y_B_on_line, 'g^', markersize=12)
    ax.text(2, y_B_on_line + 0.3, "Event B'", fontsize=11, ha='center')

    # Draw the moving observer's worldline
    t_max = 4
    x_max = v * t_max
    ax.plot([0, x_max], [0, t_max], 'g-', linewidth=2, alpha=0.5, label='Moving observer')

    ax.set_xlabel('Position x', fontsize=12)
    ax.set_ylabel('Time t', fontsize=12)
    ax.set_title('Relativity of Simultaneity: No Universal "Now"!', fontsize=14, fontweight='bold')
    ax.legend(loc='upper left', fontsize=11)
    ax.grid(True, alpha=0.3)
    ax.set_xlim(-3, 3)
    ax.set_ylim(-1, 4)

    mo.plot(fig)
    return


@app.cell
def _(mo, velocity_sim):
    v = velocity_sim.value

    mo.md(f"""
    ### The Stunning Truth

    - **Blue line:** Two events that are simultaneous in the stationary frame (both at t=1)
    - **Green dashed line:** Events that are simultaneous in the *moving* frame

    **The key insight:** Different frames have different lines of "now"!

    In the stationary frame:
    - Event A happens first, then Event B

    In the moving frame:
    - Event B happens *earlier* than Event A!

    This isn't wrong—there's no universal order. Events that are simultaneous in one 
    frame are *not* simultaneous in another. This is the deepest consequence of relativity.

    **Physical meaning:** There is no absolute present moment in the universe. 
    The "now" depends on your reference frame.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Part 6: The Geometry Underneath (4-Vectors)

    All of these effects—time dilation, length contraction, relativity of simultaneity—
    come from a single geometric fact:

    **The spacetime interval is invariant.**

    In relativity, we don't measure distance like Pythagoras:

    $$d^2 = (\Delta x)^2 + (\Delta t)^2$$

    Instead, we measure the *spacetime interval*:

    $$s^2 = (\Delta t)^2 - (\Delta x)^2$$

    (With c=1; multiply by c² for real units)

    This *looks* like Pythagoras with a minus sign. It's called the **Minkowski metric**.

    **The magic:** This interval is the *same in all reference frames*!
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ### Example: Invariant Interval

    You're at rest. Your friend zooms by at 0.6c.
    You both observe two light flashes separated by:
    - 3 seconds in your frame
    - 1 light-second in space

    **In your frame:**
    $$s^2 = (\Delta t)^2 - (\Delta x)^2 = 3^2 - 1^2 = 9 - 1 = 8$$

    **In your friend's frame (moving at 0.6c):**
    - The events get Lorentz transformed...
    - But when you calculate the interval:
    $$s^2 = (\Delta t')^2 - (\Delta x')^2 = 8$$

    **Same!** This is why all the relativistic effects work:
    they're just different ways of splitting the invariant interval into space and time.
    """)
    return


@app.cell
def _(mo):
    mo.md("""
    ## Summary: The Geometric Picture

    Spacetime isn't flat Euclidean geometry (with Pythagoras).

    It's **Minkowski geometry** (with the interval).

    Every relativistic effect flows from this one geometric fact:

    | Effect | Why? |
    |--------|------|
    | Time dilation | Moving clocks travel at an angle through spacetime |
    | Length contraction | Rulers aligned in different directions through spacetime |
    | Relativity of simultaneity | Different frames have different "horizontal" slices through spacetime |
    | Nothing faster than light | Worldlines steeper than 45° would exceed light speed |

    **The deeper truth:**

    Special relativity isn't about strange quantum effects or abstract math.
    It's about the *geometry* of the universe.

    Once you see the Minkowski diagram, everything becomes obvious.
    """)
    return


@app.cell
def _(mo):
    mo.md(r"""
    ## Final Challenge: Connect the Dots

    Now that you understand the geometry, try this:

    **Question:** If you travel in a spaceship at 0.9c for 1 year (your time),
    how much time passes on Earth?

    Use the formula:
    $$\Delta t = \gamma \Delta t_0 = \frac{\Delta t_0}{\sqrt{1 - v^2/c^2}}$$

    Then think: Why does this make sense in the Minkowski diagram?
    """)
    return


@app.cell
def _(mo):
    velocity_challenge = mo.ui.slider(
        label="Your spaceship velocity:",
        start=0.1,
        stop=0.99,
        step=0.01,
        value=0.9
    )

    proper_time = mo.ui.number_input(
        label="Your ship's proper time (years):",
        start=1,
        step=1,
        value=1
    )
    return proper_time, velocity_challenge


@app.cell
def _(mo, np, proper_time, velocity_challenge):
    v = velocity_challenge.value
    tau = proper_time.value

    gamma = 1 / np.sqrt(1 - v**2)
    coordinate_time = gamma * tau

    mo.md(f"""
    ### Your Journey

    - **Your velocity:** {v:.1%}c
    - **Your ship's clock says:** {tau} years pass
    - **Earth's clocks say:** {coordinate_time:.2f} years pass

    **You've aged {tau} year(s), but Earth has aged {coordinate_time:.2f} years!**

    This is the **twin paradox** foundation: the twin who travels ages less.

    In the Minkowski diagram, your worldline is *tilted* compared to Earth's.
    The same "distance" along your worldline corresponds to a *longer* 
    distance when projected onto Earth's time axis.

    **That's time dilation from geometry.**
    """)
    return (gamma,)


@app.cell
def _(mo):
    mo.md("""
    ## Quick Checkpoint

    Before wrapping up, write one sentence explaining why time dilation is a geometric effect.
    """)

    checkpoint_note = mo.ui.text_area(
        label="Your one-sentence explanation:",
        placeholder="Example: A moving clock follows a tilted worldline, so its proper time projects to a longer coordinate time in another frame.",
        value="",
    )
    checkpoint_note
    return (checkpoint_note,)


@app.cell
def _(checkpoint_note, mo):
    mo.md(f"""
    **Your note:**
    {checkpoint_note.value if checkpoint_note.value else "(waiting for your explanation...)"}
    """)
    return


@app.cell
def _(mo):
    mo.md("""
    ---

    ## What's Next?

    You now understand the geometric heart of special relativity!

    If you want to go deeper, the next steps are:

    1. **Lorentz Transformations** - How coordinates actually change between frames
    2. **4-Vectors** - How momentum and energy are unified in spacetime
    3. **General Relativity** - Curved spacetime and gravity

    But remember: everything you learn will be a consequence of
    the geometric picture you see here.

    **The universe is written in the language of geometry.**

    🌌
    """)
    return


if __name__ == "__main__":
    app.run()
