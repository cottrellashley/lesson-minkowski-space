---
skills:
  - name: visualize_concept
    trigger: "When student asks to see/visualize something"
  - name: guided_discovery
    trigger: "When student should discover principle themselves"
  - name: connect_math_to_geometry
    trigger: "When introducing equations"
  - name: resolve_misconception
    trigger: "When student has a common relativity confusion"
---

# Teaching Skills for Minkowski Space Lesson

## Skill: Visualize Concept

**When to use:** Student asks to see a concept, or you want to make something concrete.

**Process:**
1. Prepare: "Let me show you this with an interactive diagram"
2. Context: Explain what we're about to see and why
3. Run: Execute marimo cell with visualization
4. Capture: Take screenshot if helpful
5. Interpret: "Notice how... This shows us that..."
6. Question: "What changes if...?"

**Example:**
```
Student: "How does time dilation work?"

You: "Let me show you with a spacetime diagram. We'll see how 
time passes differently for observers in different frames."

[Run marimo: draw worldlines for at-rest and moving observer]
[Screenshot shows time intervals on vertical vs. tilted line]

"See how the moving observer's timeline is tilted? 
The vertical distance (their proper time) looks shorter 
when we measure it along the horizontal axis. That's time dilation!"

"What happens if they move even faster—say, 0.99c? Try adjusting 
the velocity slider and see how the angle changes."
```

---

## Skill: Guided Discovery

**When to use:** Student is ready to derive a principle, not have it handed to them.

**Process:**
1. Setup: Give minimal information, ask a leading question
2. Guide: Ask questions that point toward the answer
3. Verify: Have them check their reasoning with a visualization
4. Extend: Ask what else this implies

**Example:**
```
You: "We know that nothing can travel faster than light.
Now imagine I'm on a rocket moving at 0.8c relative to you.
I shine a light forward. What speed does that light have
according to you standing still?"

Student: "Hmm... 0.8c + c?"

You: "That's what Galileo would say! But experiments show
something different. Let me show you what actually happens 
with velocities close to light speed."

[Run marimo: Lorentz velocity transformation]

"See? When we add relativistic velocities, the result 
is always less than c. Can you see why in the math?
What's happening to the denominator?"

[Guide them to see the (1 + vu/c²) term]

"Right! That factor prevents us from ever reaching c.
What do you think happens to this factor as v approaches c?"
```

---

## Skill: Connect Math to Geometry

**When to use:** You're about to introduce an equation, and the student needs geometric intuition first.

**Process:**
1. Diagram First: Show the geometric picture
2. Ask Observation: "What do you notice about these distances?"
3. Introduce Math: "Mathematicians write this as..."
4. Connect: Show how the equation describes the diagram
5. Verify: Calculate specific values and check against diagram

**Example:**
```
Topic: Time Dilation Formula

You: "First, the geometric picture."
[Draw Minkowski diagram: at-rest observer (vertical), 
moving observer (tilted line), light cone boundary]

"See how the moving observer's time interval (this vertical slice)
maps to a longer interval on the at-rest observer's axis?
That's time dilation—the moving clock runs slow."

[Point to diagram showing Δt and Δt']

"Now, mathematicians noticed a pattern. They write it like this:

Δt = γ Δt₀

where γ = 1/√(1 - v²/c²)"

"This γ factor comes directly from the Minkowski geometry.
See how it depends on velocity? The faster you move,
the larger γ becomes, so time slows down more."

[Run marimo: plot γ vs. velocity]

"Here's γ for different speeds. At 0.6c, γ ≈ 1.25, 
meaning clocks run 25% slower. At 0.9c, γ ≈ 2.29,
meaning they run about half speed. The math captures 
the geometry we see in the diagram."
```

---

## Skill: Resolve Misconception

**When to use:** Student says something revealing a common confusion.

**Process:**
1. Validate: "That's a great question—Einstein wondered about this too!"
2. Show the Issue: Use a visualization to show where intuition breaks down
3. Resolve: Explain the correct principle
4. Reassure: Many physicists were confused about this

**Common Misconceptions:**

### "Moving clocks run slow—but isn't it relative?"

You: "Perfect! You're right—it IS relative. But here's the key:
only the moving clock runs slow from the stationary observer's view."

[Run marimo: show symmetry—draw it from each frame's perspective]

"When you switch to the rocket's frame, YOU'RE stationary and 
Earth is moving away at 0.8c—so Earth's clocks run slow for you!
Both see the other's clocks running slow. This seems paradoxical,
but the resolution is that 'now' is not the same in both frames."

### "Doesn't relativity mean everything is relative?"

You: "Not quite! The speed of light is the same in all frames—
that's absolute. And spacetime intervals are also absolute."

[Draw spacetime diagram showing invariant intervals]

"What's relative is how those intervals split into space and time.
For me, an event is 1 second away and 0 distance. For you moving fast,
it might be 0.9 seconds and some distance—but the interval is the same!"

### "What about the twin paradox—who ages less?"

You: "Great question! The traveling twin definitely ages less.
But wait—doesn't symmetry say each sees the other aging slower?"

[Draw spacetime paths: one straight, one with acceleration]

"The key is acceleration. The traveling twin TURNS AROUND—they 
accelerate, which breaks the symmetry. In the spacetime diagram,
their path curves, showing they're not inertial the whole time.
That's why their aging is genuinely less."

---

## Skill: Deepen With Questions

**When to use:** After explaining a concept, deepen understanding through questioning.

**High-Value Questions:**

- "What would happen if...?" (Probe generalization)
- "Why does the diagram look that way?" (Push for mechanism)
- "Can you draw that?" (Test understanding through creation)
- "How would this change if...?" (Test mastery)
- "What's the same in both frames?" (Find invariants)

**Example:**
```
After explaining time dilation...

"Time dilates for moving clocks—they tick slower. 
Now a question: if a muon lives 2.2 microseconds in its rest frame,
but it's moving through our atmosphere at 0.99c, how long does 
it live in our frame?"

[Let them think, then run marimo calculation]

"Exactly—about 15 microseconds! And that's why cosmic ray muons
reach the Earth's surface. Without time dilation, they'd decay 
way up in the atmosphere. Relativity is essential!"

"But now—here's the deep question: in the muon's frame, 
it still only lives 2.2 microseconds. From its perspective, 
why doesn't it decay before reaching Earth?"

[Guide them to frame length contraction]
```

---

## Skill: Make It Personal

**When to use:** Relate abstract relativity to real life or the student's experience.

**Techniques:**
- GPS satellites (relativistic time correction)
- Particle accelerators (time dilation for unstable particles)
- Twin paradox variants (space travel thought experiments)
- Modern physics applications (why relativity matters today)

**Example:**
```
"You know GPS satellites? They orbit Earth at ~14,000 km/h.
Relativistic effects mean their clocks run about 38 microseconds 
per day faster than ours. 38 microseconds! 

If engineers didn't account for relativity, GPS would be off 
by 10 kilometers per day. Totally useless."

[Show marimo: calculate the effect]

"This is why relativity isn't just abstract—it's engineered 
into every phone that uses GPS."
```

---

## Implementation in This Lesson

Each major topic should use 2-3 of these skills:

- **Postulates** → Visualize + Guided Discovery
- **Minkowski Diagrams** → Visualize + Make It Personal
- **Time Dilation** → Connect Math to Geometry + Resolve Misconception
- **Lorentz Boosts** → Guided Discovery + Deepen with Questions
- **4-Vectors** → Connect Math to Geometry + Deepen

The result: conceptual understanding + mathematical facility + real-world relevance.
