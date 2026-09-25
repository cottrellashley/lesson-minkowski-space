(function () {
  "use strict";

  /* ── elements ───────────────────────────────────── */

  const canvas   = document.getElementById("canvas");
  const ctx      = canvas.getContext("2d");
  const titleEl  = document.getElementById("title");
  const narEl    = document.getElementById("narrative");
  const nextBtn  = document.getElementById("next");
  const dotsEl   = document.getElementById("dots");
  const cPanel   = document.getElementById("coord-panel");
  const vPanel   = document.getElementById("vector-panel");

  const vpHint   = document.getElementById("vp-hint");
  const vpPosD   = document.getElementById("vp-pos-data");
  const vpX      = document.getElementById("vp-x");
  const vpY      = document.getElementById("vp-y");
  const vpMag    = document.getElementById("vp-mag");
  const vpSpeed  = document.getElementById("vp-speed");
  const vpSA     = document.getElementById("vp-sa");
  const vpSB     = document.getElementById("vp-sb");
  const vpRelSpd = document.getElementById("vp-rel-speed");

  const vpSections = {
    pos: document.getElementById("vp-pos"),
    vel: document.getElementById("vp-vel"),
    rel: document.getElementById("vp-rel"),
  };

  const frameSec = document.getElementById("frame-section");
  const matchA   = document.getElementById("match-a");
  const matchB   = document.getElementById("match-b");
  const lockBtn  = document.getElementById("lock-view");

  const slider = {
    ox:  document.getElementById("ox"),
    oy:  document.getElementById("oy"),
    rot: document.getElementById("rot"),
    scx: document.getElementById("scx"),
    scy: document.getElementById("scy"),
    fvx: document.getElementById("fvx"),
    fvy: document.getElementById("fvy"),
  };

  const readout = {
    ox:  document.getElementById("ox-val"),
    oy:  document.getElementById("oy-val"),
    rot: document.getElementById("rot-val"),
    scx: document.getElementById("scx-val"),
    scy: document.getElementById("scy-val"),
    fvx: document.getElementById("fvx-val"),
    fvy: document.getElementById("fvy-val"),
  };

  /* ── lesson steps ───────────────────────────────── */

  const STEPS = [
    { text: "", label: "Begin" },
    {
      text: "Before you stretches a manifold \u2014 a smooth, continuous surface. In general relativity, spacetime itself is such a surface: a living geometry shaped by mass and energy.",
      label: "\u2192",
    },
    {
      text: "Events are scattered across this manifold \u2014 a photon striking a detector, a clock\u2019s tick, the beat of a heart. Each occupies a definite point. But how do you measure the distance between them?",
      label: "\u2192",
    },
    {
      text: "We lay down coordinates \u2014 a human invention for labeling points with numbers. Slide the origin, rotate the axes, stretch the scale. The labels change, but the geometry does not. Click any point to track its position vector.",
      label: "\u2192",
    },
    {
      text: "A particle drifts across the manifold. Use the frame velocity sliders to move your coordinate system \u2014 or hit Match to ride along with the particle. When the frame matches, its speed drops to zero. A single particle\u2019s velocity is not a physical truth \u2014 it depends entirely on who is watching.",
      label: "\u2192",
    },
    {
      text: "A second particle appears. Change the frame \u2014 each particle\u2019s speed shifts. But the relative speed between them stays fixed no matter what. Relative velocity is invariant \u2014 it doesn\u2019t care about your perspective. This is the kind of quantity that physics is built on.",
      label: "\u21BA",
    },
  ];

  /* ── constants ──────────────────────────────────── */

  const PLANE = 280;
  const TAU   = 6.2832;

  const PART_A = { du: 0.18, dv: 0.10 };
  const PART_B = { du: -0.08, dv: 0.14 };

  const COL_A = { r: 218, g: 178, b: 72 };
  const COL_B = { r: 72,  g: 185, b: 165 };

  /* ── state ──────────────────────────────────────── */

  const state = {
    step: 0,
    w: 0, h: 0, dpr: 1,
    time: 0,
    cam: { yaw: -0.5, pitch: 0.38, dist: 780, focal: 780 },
    drag: { on: false, x: 0, y: 0, sx: 0, sy: 0 },
    fade: { manifold: 0, points: 0, coords: 0, posProbe: 0, particleA: 0, particleB: 0 },
    stars: [],
    events: [],
    probe: null,

    particleA: { u: -0.5, v: -0.3, du: PART_A.du, dv: PART_A.dv, trail: [] },
    particleB: { u:  0.4, v:  0.5, du: PART_B.du, dv: PART_B.dv, trail: [] },

    frameVel:   { u: 0, v: 0 },
    coordDrift: { u: 0, v: 0 },
    viewOffset: { u: 0, v: 0 },
    viewLocked: false,
  };

  /* ── canvas sizing (HiDPI) ──────────────────────── */

  function resize() {
    state.dpr = devicePixelRatio || 1;
    state.w   = innerWidth;
    state.h   = innerHeight;
    canvas.width  = state.w * state.dpr;
    canvas.height = state.h * state.dpr;
  }

  /* ── starfield ──────────────────────────────────── */

  function initStars() {
    for (let i = 0; i < 520; i++) {
      state.stars.push({
        x:  Math.random(),
        y:  Math.random(),
        r:  0.2 + Math.random() * 1.05,
        b:  0.1 + Math.random() * 0.5,
        ph: Math.random() * TAU,
        sp: 0.12 + Math.random() * 0.55,
      });
    }
  }

  function drawStars() {
    const { w, h, time } = state;
    for (const s of state.stars) {
      const a = Math.max(0, Math.min(1, s.b + 0.1 * Math.sin(time * s.sp + s.ph)));
      ctx.fillStyle = `rgba(192,206,230,${a.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, TAU);
      ctx.fill();
    }
  }

  /* ── 3-D helpers ────────────────────────────────── */

  function mp(u, v) {
    return {
      x: (u - state.viewOffset.u) * PLANE,
      y: (v - state.viewOffset.v) * PLANE,
      z: 0,
    };
  }

  function rot(p) {
    const cy = Math.cos(state.cam.yaw),  sy = Math.sin(state.cam.yaw);
    const cp = Math.cos(state.cam.pitch), sp = Math.sin(state.cam.pitch);
    const x1 = cy * p.x + sy * p.z;
    const z1 = -sy * p.x + cy * p.z;
    return { x: x1, y: cp * p.y - sp * z1, z: sp * p.y + cp * z1 };
  }

  function invRot(p) {
    const cy = Math.cos(state.cam.yaw),  sy = Math.sin(state.cam.yaw);
    const cp = Math.cos(state.cam.pitch), sp = Math.sin(state.cam.pitch);
    const y1 = cp * p.y + sp * p.z;
    const z1 = -sp * p.y + cp * p.z;
    return { x: cy * p.x - sy * z1, y: y1, z: sy * p.x + cy * z1 };
  }

  function proj(p) {
    const zc = p.z + state.cam.dist;
    if (zc < 1) return null;
    const k = state.cam.focal / zc;
    return { x: state.w / 2 + p.x * k, y: state.h / 2 - p.y * k };
  }

  function unproject(sx, sy) {
    const dx = (sx - state.w / 2) / state.cam.focal;
    const dy = -(sy - state.h / 2) / state.cam.focal;
    const o = invRot({ x: 0, y: 0, z: -state.cam.dist });
    const d = invRot({ x: dx, y: dy, z: 1 });
    if (Math.abs(d.z) < 1e-10) return null;
    const t = -o.z / d.z;
    if (t < 0) return null;
    const u = (o.x + t * d.x) / PLANE + state.viewOffset.u;
    const v = (o.y + t * d.y) / PLANE + state.viewOffset.v;
    if (u < -1 || u > 1 || v < -1 || v > 1) return null;
    return { u, v };
  }

  function wrapVal(v) {
    return ((v % 2) + 3) % 2 - 1;
  }

  function wrapNear(val, center) {
    let d = val - center;
    d = ((d % 2) + 3) % 2 - 1;
    return center + d;
  }

  /* ── drawing utilities ──────────────────────────── */

  function drawArrow(from, to, color) {
    const dx = to.x - from.x, dy = to.y - from.y;
    if (dx * dx + dy * dy < 4) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    const ang = Math.atan2(dy, dx);
    const hl = 7;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - hl * Math.cos(ang - 0.3), to.y - hl * Math.sin(ang - 0.3));
    ctx.lineTo(to.x - hl * Math.cos(ang + 0.3), to.y - hl * Math.sin(ang + 0.3));
    ctx.closePath();
    ctx.fill();
  }

  function drawArrowLabeled(from, to, color, label) {
    drawArrow(from, to, color);
    if (label) {
      ctx.font = "600 11px system-ui, sans-serif";
      ctx.fillStyle = color;
      ctx.fillText(label, to.x + 7, to.y + 3);
    }
  }

  function drawVectorVisuals(data, a, color) {
    const oS = proj(rot(mp(data.originU, data.originV)));
    const tS = proj(rot(mp(data.tipU, data.tipV)));
    if (!oS || !tS) return;

    const dx = tS.x - oS.x, dy = tS.y - oS.y;
    if (dx * dx + dy * dy < 4) return;

    const adu = data.tipU - data.originU;
    const adv = data.tipV - data.originV;
    const pxLen = adu * data.cosT + adv * data.sinT;
    const pyLen = -adu * data.sinT + adv * data.cosT;

    const fxS = proj(rot(mp(
      data.originU + pxLen * data.cosT,
      data.originV + pxLen * data.sinT)));
    const fyS = proj(rot(mp(
      data.originU - pyLen * data.sinT,
      data.originV + pyLen * data.cosT)));

    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = `rgba(150,170,200,${(a * 0.22).toFixed(3)})`;
    if (fxS) {
      ctx.beginPath(); ctx.moveTo(tS.x, tS.y); ctx.lineTo(fxS.x, fxS.y); ctx.stroke();
    }
    if (fyS) {
      ctx.beginPath(); ctx.moveTo(tS.x, tS.y); ctx.lineTo(fyS.x, fyS.y); ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.restore();

    drawArrow(oS, tS, color);
  }

  /* ── manifold ───────────────────────────────────── */

  function drawManifold(a) {
    if (a < 0.003) return;

    const locked = state.viewLocked;
    const ext = locked ? 1.5 : 1;
    const cx = locked ? state.viewOffset.u : 0;
    const cy = locked ? state.viewOffset.v : 0;

    const corners = [
      [cx - ext, cy - ext], [cx + ext, cy - ext],
      [cx + ext, cy + ext], [cx - ext, cy + ext],
    ].map(([u, v]) => proj(rot(mp(u, v))));
    if (corners.some(p => !p)) return;

    if (!locked) {
      ctx.save();
      ctx.shadowColor = `rgba(20,65,140,${(0.16 * a).toFixed(3)})`;
      ctx.shadowBlur = 45;
      ctx.fillStyle = `rgba(4,10,22,${(0.3 * a).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = `rgba(4,10,22,${(0.42 * a).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
    ctx.closePath();
    ctx.fill();

    if (!locked) {
      ctx.strokeStyle = `rgba(50,120,200,${(0.12 * a).toFixed(3)})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
      ctx.closePath();
      ctx.stroke();
    }
  }

  /* ── event points ───────────────────────────────── */

  function initEvents() {
    for (let i = 0; i < 65; i++) {
      state.events.push({
        u:  -0.86 + 1.72 * Math.random(),
        v:  -0.86 + 1.72 * Math.random(),
        b:  0.2 + 0.8 * Math.random(),
        ph: Math.random() * TAU,
        sp: 0.2 + Math.random() * 0.4,
      });
    }
  }

  function drawEvents(a) {
    if (a < 0.003) return;
    for (const e of state.events) {
      const eu = state.viewLocked ? wrapNear(e.u, state.viewOffset.u) : e.u;
      const ev = state.viewLocked ? wrapNear(e.v, state.viewOffset.v) : e.v;
      const p = proj(rot(mp(eu, ev)));
      if (!p) continue;

      const pulse = e.b + 0.15 * Math.sin(state.time * e.sp + e.ph);
      const ea = Math.max(0, Math.min(1, pulse)) * a;

      ctx.fillStyle = `rgba(110,148,210,${(ea * 0.1).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, TAU);
      ctx.fill();

      ctx.fillStyle = `rgba(170,192,228,${(ea * 0.85).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, TAU);
      ctx.fill();
    }
  }

  /* ── coordinate system ──────────────────────────── */

  function getEffectiveOrigin() {
    return {
      u: +slider.ox.value + state.coordDrift.u,
      v: +slider.oy.value + state.coordDrift.v,
    };
  }

  function getCoordParams() {
    const eo = getEffectiveOrigin();
    const locked = state.viewLocked;
    return {
      ox:  locked ? eo.u : wrapVal(eo.u),
      oy:  locked ? eo.v : wrapVal(eo.v),
      th:  +slider.rot.value * Math.PI / 180,
      scx: +slider.scx.value,
      scy: +slider.scy.value,
    };
  }

  function drawCoords(a) {
    if (a < 0.003) return;

    const { ox, oy, th, scx, scy } = getCoordParams();
    const len = 0.34 * PLANE;

    const oW = mp(ox, oy);
    const oS = proj(rot(oW));
    if (!oS) return;

    const xT = proj(rot({ x: oW.x + Math.cos(th) * len * scx,
                           y: oW.y + Math.sin(th) * len * scx, z: 0 }));
    const yT = proj(rot({ x: oW.x - Math.sin(th) * len * scy,
                           y: oW.y + Math.cos(th) * len * scy, z: 0 }));
    if (!xT || !yT) return;

    drawArrowLabeled(oS, xT, `rgba(75,138,208,${(a * 0.85).toFixed(3)})`, "x\u2032");
    drawArrowLabeled(oS, yT, `rgba(60,155,142,${(a * 0.85).toFixed(3)})`, "y\u2032");

    ctx.fillStyle = `rgba(120,158,210,${(a * 0.8).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(oS.x, oS.y, 3, 0, TAU);
    ctx.fill();
  }

  /* ── generic probe / vector system ──────────────── */

  function createProbe(type, u, v, opts) {
    return { type, u, v, ...opts };
  }

  function resolveProbe(probe, params) {
    const { ox, oy, th, scx, scy } = params;
    const cosT = Math.cos(th), sinT = Math.sin(th);

    if (probe.type === "position") {
      const du = probe.u - ox;
      const dv = probe.v - oy;
      return {
        vector: [(du * cosT + dv * sinT) / scx, (-du * sinT + dv * cosT) / scy],
        magnitude: Math.sqrt(du * du + dv * dv),
        originU: ox, originV: oy,
        tipU: probe.u, tipV: probe.v,
        cosT, sinT,
      };
    }

    return null;
  }

  /* ── position probe (step 3) ────────────────────── */

  function drawProbe(a) {
    if (a < 0.003 || !state.probe) return;

    const data = resolveProbe(state.probe, getCoordParams());
    if (!data) return;

    drawVectorVisuals(data, a, `rgba(218,178,72,${(a * 0.82).toFixed(3)})`);

    const tS = proj(rot(mp(data.tipU, data.tipV)));
    if (!tS) return;
    ctx.fillStyle = `rgba(218,178,72,${(a * 0.12).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(tS.x, tS.y, 7, 0, TAU);
    ctx.fill();
    ctx.fillStyle = `rgba(228,190,80,${(a * 0.88).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(tS.x, tS.y, 2.2, 0, TAU);
    ctx.fill();
  }

  /* ── particles ──────────────────────────────────── */

  function resetParticles() {
    const a = state.particleA;
    a.u = -0.5; a.v = -0.3; a.trail = [];

    const b = state.particleB;
    b.u = 0.4; b.v = 0.5; b.trail = [];

    state.coordDrift.u = 0;
    state.coordDrift.v = 0;
    state.frameVel.u = 0;
    state.frameVel.v = 0;
    state.viewLocked = false;
    state.viewOffset.u = 0;
    state.viewOffset.v = 0;

    slider.fvx.value = 0;
    slider.fvy.value = 0;
    lockBtn.classList.remove("active");
    lockBtn.textContent = "Lock view";
  }

  function updateParticle(p, dt) {
    p.u += p.du * dt;
    p.v += p.dv * dt;
    p.u = wrapVal(p.u);
    p.v = wrapVal(p.v);
    p.trail.push({ u: p.u, v: p.v });
    if (p.trail.length > 80) p.trail.shift();
  }

  function particleRelVel(p) {
    return {
      u: p.du - state.frameVel.u,
      v: p.dv - state.frameVel.v,
    };
  }

  function drawParticleBody(p, a, col, isLocked) {
    const pu = isLocked ? wrapNear(p.u, state.viewOffset.u) : p.u;
    const pv = isLocked ? wrapNear(p.v, state.viewOffset.v) : p.v;

    const len = p.trail.length;
    for (let i = 0; i < len; i++) {
      const tu = isLocked ? wrapNear(p.trail[i].u, state.viewOffset.u) : p.trail[i].u;
      const tv = isLocked ? wrapNear(p.trail[i].v, state.viewOffset.v) : p.trail[i].v;
      const s = proj(rot(mp(tu, tv)));
      if (!s) continue;
      const f = i / Math.max(1, len - 1);
      ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${(f * a * 0.35).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 0.6 + f * 1.4, 0, TAU);
      ctx.fill();
    }

    const ps = proj(rot(mp(pu, pv)));
    if (!ps) return null;

    ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${(a * 0.14).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(ps.x, ps.y, 10, 0, TAU);
    ctx.fill();

    ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${(a * 0.92).toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(ps.x, ps.y, 3, 0, TAU);
    ctx.fill();

    return { pu, pv };
  }

  function drawParticleA(a) {
    if (a < 0.003) return;
    drawParticleBody(state.particleA, a, COL_A, state.viewLocked);
  }

  function drawParticleB(a) {
    if (a < 0.003) return;
    drawParticleBody(state.particleB, a, COL_B, state.viewLocked);
  }

  /* ── coordinate drift + view ────────────────────── */

  function updateCoordDrift(dt) {
    if (state.step < 4) return;
    state.coordDrift.u += state.frameVel.u * dt;
    state.coordDrift.v += state.frameVel.v * dt;
  }

  function updateViewOffset() {
    if (state.viewLocked) {
      const eo = getEffectiveOrigin();
      state.viewOffset.u = eo.u;
      state.viewOffset.v = eo.v;
    } else {
      state.viewOffset.u = 0;
      state.viewOffset.v = 0;
    }
  }

  /* ── layer fade interpolation ───────────────────── */

  function updateFades(dt) {
    const targets = {
      manifold:  state.step >= 1 ? 1 : 0,
      points:    state.step >= 2 ? 1 : 0,
      coords:    state.step >= 3 ? 1 : 0,
      posProbe:  (state.step === 3 && state.probe) ? 1 : 0,
      particleA: state.step >= 4 ? 1 : 0,
      particleB: state.step >= 5 ? 1 : 0,
    };
    for (const k of Object.keys(targets)) {
      state.fade[k] += (targets[k] - state.fade[k]) * Math.min(1, 2.6 * dt);
    }
  }

  /* ── render loop ────────────────────────────────── */

  let prev = 0;

  function frame(ts) {
    const dt = Math.min(0.1, (ts - prev) / 1000);
    prev = ts;
    state.time += dt;

    updateFades(dt);
    updateCoordDrift(dt);
    updateViewOffset();
    if (state.step >= 4) updateParticle(state.particleA, dt);
    if (state.step >= 5) updateParticle(state.particleB, dt);

    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, state.w, state.h);

    drawStars();
    drawManifold(state.fade.manifold);
    drawEvents(state.fade.points);
    drawCoords(state.fade.coords);
    drawProbe(state.fade.posProbe);
    drawParticleA(state.fade.particleA);
    drawParticleB(state.fade.particleB);

    if (state.step >= 4) refreshVectorPanel();

    requestAnimationFrame(frame);
  }

  /* ── UI helpers ─────────────────────────────────── */

  function refreshDots() {
    dotsEl.innerHTML = "";
    for (let i = 0; i < STEPS.length; i++) {
      const d = document.createElement("span");
      d.className = "dot" + (i === state.step ? " active" : "");
      dotsEl.appendChild(d);
    }
  }

  function showVpSection(name) {
    for (const [k, el] of Object.entries(vpSections)) {
      el.classList.toggle("active", k === name);
    }
  }

  function refreshVectorPanel() {
    if (state.step === 3) {
      showVpSection("pos");
      if (state.probe) {
        const data = resolveProbe(state.probe, getCoordParams());
        if (data) {
          vpX.textContent   = data.vector[0].toFixed(2);
          vpY.textContent   = data.vector[1].toFixed(2);
          vpMag.textContent = data.magnitude.toFixed(3);
          vpPosD.classList.add("active");
          vpHint.classList.add("hidden");
        }
      } else {
        vpPosD.classList.remove("active");
        vpHint.classList.remove("hidden");
      }
      return;
    }

    if (state.step === 4) {
      showVpSection("vel");
      const rv = particleRelVel(state.particleA);
      vpSpeed.textContent = Math.sqrt(rv.u * rv.u + rv.v * rv.v).toFixed(3);
      return;
    }

    if (state.step >= 5) {
      showVpSection("rel");
      const rva = particleRelVel(state.particleA);
      const rvb = particleRelVel(state.particleB);
      vpSA.textContent = Math.sqrt(rva.u * rva.u + rva.v * rva.v).toFixed(3);
      vpSB.textContent = Math.sqrt(rvb.u * rvb.u + rvb.v * rvb.v).toFixed(3);

      const ddu = state.particleA.du - state.particleB.du;
      const ddv = state.particleA.dv - state.particleB.dv;
      vpRelSpd.textContent = Math.sqrt(ddu * ddu + ddv * ddv).toFixed(3);
      return;
    }

    showVpSection("pos");
  }

  function refreshFrameSection() {
    const show = state.step >= 4;
    frameSec.classList.toggle("visible", show);
    matchB.classList.toggle("visible", state.step >= 5);
  }

  function refreshNarrative() {
    narEl.classList.remove("visible");
    setTimeout(() => {
      narEl.textContent = STEPS[state.step].text;
      if (STEPS[state.step].text) narEl.classList.add("visible");
    }, 220);

    nextBtn.textContent = STEPS[state.step].label;
    titleEl.classList.toggle("hidden", state.step > 0);
    cPanel.classList.toggle("visible", state.step >= 3);
    vPanel.classList.toggle("visible", state.step >= 3);

    refreshFrameSection();
    refreshVectorPanel();
    refreshDots();
  }

  function refreshReadouts() {
    readout.ox.textContent  = (+slider.ox.value).toFixed(2);
    readout.oy.textContent  = (+slider.oy.value).toFixed(2);
    readout.rot.textContent = Math.round(+slider.rot.value) + "\u00B0";
    readout.scx.textContent = (+slider.scx.value).toFixed(2);
    readout.scy.textContent = (+slider.scy.value).toFixed(2);
    readout.fvx.textContent = (+slider.fvx.value).toFixed(2);
    readout.fvy.textContent = (+slider.fvy.value).toFixed(2);

    state.frameVel.u = +slider.fvx.value;
    state.frameVel.v = +slider.fvy.value;

    refreshVectorPanel();
  }

  /* ── event wiring ───────────────────────────────── */

  function advanceStep() {
    state.step = (state.step + 1) % STEPS.length;

    if (state.step === 0) {
      state.probe = null;
      resetParticles();
    }
    if (state.step === 4 || state.step === 5) {
      resetParticles();
    }

    refreshNarrative();
  }

  nextBtn.addEventListener("click", advanceStep);

  [slider.ox, slider.oy, slider.rot, slider.scx, slider.scy,
   slider.fvx, slider.fvy].forEach(s => s.addEventListener("input", refreshReadouts));

  addEventListener("keydown", e => {
    if (document.activeElement && document.activeElement.tagName === "INPUT") return;
    if (e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      advanceStep();
    }
  });

  matchA.addEventListener("click", () => {
    slider.fvx.value = state.particleA.du;
    slider.fvy.value = state.particleA.dv;
    refreshReadouts();
  });

  matchB.addEventListener("click", () => {
    slider.fvx.value = state.particleB.du;
    slider.fvy.value = state.particleB.dv;
    refreshReadouts();
  });

  lockBtn.addEventListener("click", () => {
    state.viewLocked = !state.viewLocked;
    lockBtn.classList.toggle("active", state.viewLocked);
    lockBtn.textContent = state.viewLocked ? "Unlock view" : "Lock view";
  });

  canvas.addEventListener("pointerdown", e => {
    state.drag = { on: true, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY };
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", e => {
    if (!state.drag.on) return;
    state.cam.yaw   += (e.clientX - state.drag.x) * 0.005;
    state.cam.pitch  = Math.max(-1.4, Math.min(1.4,
      state.cam.pitch + (e.clientY - state.drag.y) * 0.004));
    state.drag.x = e.clientX;
    state.drag.y = e.clientY;
  });

  canvas.addEventListener("pointerup", e => {
    if (!state.drag.on) return;
    const dx = e.clientX - state.drag.sx;
    const dy = e.clientY - state.drag.sy;
    state.drag.on = false;

    if (Math.sqrt(dx * dx + dy * dy) < 4 && state.step === 3) {
      const rect = canvas.getBoundingClientRect();
      const hit = unproject(e.clientX - rect.left, e.clientY - rect.top);
      if (hit) {
        state.probe = createProbe("position", hit.u, hit.v);
        refreshVectorPanel();
      }
    }
  });

  canvas.addEventListener("pointercancel", () => { state.drag.on = false; });
  addEventListener("resize", resize);

  /* ── init ───────────────────────────────────────── */

  resize();
  initStars();
  initEvents();
  refreshNarrative();
  refreshReadouts();
  requestAnimationFrame(frame);
})();
