const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const shapeButtons = [...document.querySelectorAll(".shape-btn")];
const sceneButtons = [...document.querySelectorAll(".scene-btn")];
const layerControls = document.getElementById("layerControls");
const animateTransform = document.getElementById("animateTransform");
const resetViewBtn = document.getElementById("resetView");

const state = {
  running: true,
  shape: "plane",
  time: 0,
  pointCount: 90,
  camera: { yaw: -0.58, pitch: 0.3, distance: 640, focal: 640 },
  drag: { active: false, x: 0, y: 0 },
  coord: { a0: 0.2, b0: -0.15, theta: 0.42, sx: 86, sy: 68 },
  particle: { phase: 0, speed: 0.8 },
  layers: {
    surface: true,
    points: false,
    coordinates: false,
    particle: false,
    velocityComponents: false,
    metric: false,
    connection: false
  },
  points: []
};

const layerMeta = [
  { id: "surface", label: "Base manifold", note: "core space", locked: true },
  { id: "points", label: "Random points", note: "point-set view" },
  { id: "coordinates", label: "Coordinate chart", note: "frame layer" },
  { id: "particle", label: "Moving particle", note: "dynamics layer" },
  { id: "velocityComponents", label: "Velocity components", note: "coordinate-dependent" },
  { id: "metric", label: "Metric tensor (placeholder)", note: "next layer", disabled: true },
  { id: "connection", label: "Connection (placeholder)", note: "next layer", disabled: true }
];

function clamp(value, lo, hi) {
  return Math.max(lo, Math.min(hi, value));
}

function toWorld(shape, a, b) {
  if (shape === "sphere") {
    const radius = 205;
    const theta = a;
    const yNorm = b;
    const ring = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
    return {
      x: radius * Math.cos(theta) * ring,
      y: radius * yNorm,
      z: radius * Math.sin(theta) * ring
    };
  }

  if (shape === "saddle") {
    const x = a * 240;
    const y = b * 180;
    return { x, y, z: 110 * (a * a - b * b) };
  }

  return { x: a * 275, y: b * 195, z: 0 };
}

function rotate(p) {
  const { yaw, pitch } = state.camera;
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);

  const x1 = cy * p.x + sy * p.z;
  const z1 = -sy * p.x + cy * p.z;
  const y1 = cx * p.y - sx * z1;
  const z2 = sx * p.y + cx * z1;
  return { x: x1, y: y1, z: z2 };
}

function project(r) {
  const zCam = r.z + state.camera.distance;
  if (zCam < 30) {
    return null;
  }
  const k = state.camera.focal / zCam;
  return {
    x: canvas.width * 0.5 + r.x * k,
    y: canvas.height * 0.5 - r.y * k,
    z: zCam,
    k
  };
}

function tangentBasis(shape, a, b) {
  const da = 0.0015;
  const db = 0.0015;

  const p = toWorld(shape, a, b);
  const pa = toWorld(shape, a + da, b);
  const pb = toWorld(shape, a, clamp(b + db, -0.999, 0.999));

  const ua = { x: (pa.x - p.x) / da, y: (pa.y - p.y) / da, z: (pa.z - p.z) / da };
  const ub = { x: (pb.x - p.x) / db, y: (pb.y - p.y) / db, z: (pb.z - p.z) / db };

  const na = Math.hypot(ua.x, ua.y, ua.z) || 1;
  const nb = Math.hypot(ub.x, ub.y, ub.z) || 1;

  return {
    e1: { x: ua.x / na, y: ua.y / na, z: ua.z / na },
    e2: { x: ub.x / nb, y: ub.y / nb, z: ub.z / nb }
  };
}

function resetPoints() {
  state.points = [];
  for (let i = 0; i < state.pointCount; i += 1) {
    if (state.shape === "sphere") {
      state.points.push({
        a: Math.random() * Math.PI * 2,
        b: -1 + 2 * Math.random(),
        vis: Math.random(),
        target: Math.random() > 0.6 ? 1 : 0
      });
    } else {
      state.points.push({
        a: -1 + 2 * Math.random(),
        b: -1 + 2 * Math.random(),
        vis: Math.random(),
        target: Math.random() > 0.6 ? 1 : 0
      });
    }
  }
}

function drawBackdrop() {
  ctx.fillStyle = "#f6efe0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSurface() {
  const steps = 20;
  const cells = [];

  for (let i = 0; i < steps; i += 1) {
    const a0 = -1 + (2 * i) / steps;
    const a1 = -1 + (2 * (i + 1)) / steps;
    for (let j = 0; j < steps; j += 1) {
      const b0 = -1 + (2 * j) / steps;
      const b1 = -1 + (2 * (j + 1)) / steps;

      const A = project(rotate(toWorld(state.shape, mapA(a0), mapB(b0))));
      const B = project(rotate(toWorld(state.shape, mapA(a1), mapB(b0))));
      const C = project(rotate(toWorld(state.shape, mapA(a1), mapB(b1))));
      const D = project(rotate(toWorld(state.shape, mapA(a0), mapB(b1))));

      const Ar = rotate(toWorld(state.shape, mapA(a0), mapB(b0)));
      const Br = rotate(toWorld(state.shape, mapA(a1), mapB(b0)));
      const Cr = rotate(toWorld(state.shape, mapA(a1), mapB(b1)));
      const Dr = rotate(toWorld(state.shape, mapA(a0), mapB(b1)));

      if (!A || !B || !C || !D) {
        continue;
      }

      const zAvg = (Ar.z + Br.z + Cr.z + Dr.z) / 4;
      cells.push({ A, B, C, D, zAvg });
    }
  }

  cells.sort((m, n) => m.zAvg - n.zAvg);

  for (const cell of cells) {
    const shade = clamp(0.5 + cell.zAvg / 650, 0, 1);
    const alpha = 0.24 + 0.17 * shade;
    const g = Math.round(122 + 34 * shade);
    ctx.fillStyle = `rgba(15, ${g}, 110, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(cell.A.x, cell.A.y);
    ctx.lineTo(cell.B.x, cell.B.y);
    ctx.lineTo(cell.C.x, cell.C.y);
    ctx.lineTo(cell.D.x, cell.D.y);
    ctx.closePath();
    ctx.fill();
  }
}

function mapA(a) {
  return state.shape === "sphere" ? (a + 1) * Math.PI : a;
}

function mapB(b) {
  return state.shape === "sphere" ? clamp(b, -0.999, 0.999) : b;
}

function drawPoints() {
  if (!state.layers.points) {
    return;
  }

  const items = state.points
    .map((pt) => {
      const p = project(rotate(toWorld(state.shape, pt.a, pt.b)));
      if (!p) {
        return null;
      }
      return { pt, p };
    })
    .filter(Boolean)
    .sort((u, v) => v.p.z - u.p.z);

  for (const item of items) {
    if (Math.random() < 0.003) {
      item.pt.target = item.pt.target > 0.5 ? 0 : 1;
    }
    item.pt.vis += (item.pt.target - item.pt.vis) * 0.022;
    const alpha = 0.06 + 0.84 * item.pt.vis;

    ctx.fillStyle = `rgba(18, 88, 83, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(item.p.x, item.p.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function frameAxesAt(a, b) {
  const pWorld = toWorld(state.shape, a, b);
  const pRot = rotate(pWorld);
  const pScreen = project(pRot);
  if (!pScreen) {
    return null;
  }

  const basis = tangentBasis(state.shape, a, b);
  const c = Math.cos(state.coord.theta);
  const s = Math.sin(state.coord.theta);

  const xAxis = {
    x: state.coord.sx * (c * basis.e1.x + s * basis.e2.x),
    y: state.coord.sx * (c * basis.e1.y + s * basis.e2.y),
    z: state.coord.sx * (c * basis.e1.z + s * basis.e2.z)
  };
  const yAxis = {
    x: state.coord.sy * (-s * basis.e1.x + c * basis.e2.x),
    y: state.coord.sy * (-s * basis.e1.y + c * basis.e2.y),
    z: state.coord.sy * (-s * basis.e1.z + c * basis.e2.z)
  };

  const xTip = project(rotate({ x: pWorld.x + xAxis.x, y: pWorld.y + xAxis.y, z: pWorld.z + xAxis.z }));
  const yTip = project(rotate({ x: pWorld.x + yAxis.x, y: pWorld.y + yAxis.y, z: pWorld.z + yAxis.z }));

  if (!xTip || !yTip) {
    return null;
  }

  return { pWorld, pScreen, xAxis, yAxis, xTip, yTip, basis };
}

function drawCoordinateLayer() {
  if (!state.layers.coordinates) {
    return;
  }

  const frame = frameAxesAt(state.coord.a0, state.coord.b0);
  if (!frame) {
    return;
  }

  ctx.strokeStyle = "#1e3a8a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(frame.pScreen.x, frame.pScreen.y);
  ctx.lineTo(frame.xTip.x, frame.xTip.y);
  ctx.stroke();

  ctx.strokeStyle = "#b45309";
  ctx.beginPath();
  ctx.moveTo(frame.pScreen.x, frame.pScreen.y);
  ctx.lineTo(frame.yTip.x, frame.yTip.y);
  ctx.stroke();

  ctx.fillStyle = "#1e3a8a";
  ctx.font = "700 16px Space Grotesk";
  ctx.fillText("x'", frame.xTip.x + 7, frame.xTip.y + 4);

  ctx.fillStyle = "#b45309";
  ctx.fillText("y'", frame.yTip.x + 7, frame.yTip.y + 4);

  ctx.fillStyle = "#0f766e";
  ctx.beginPath();
  ctx.arc(frame.pScreen.x, frame.pScreen.y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function particleParam(phase) {
  const a = 0.72 * Math.sin(0.63 * phase);
  const b = 0.58 * Math.cos(phase);
  if (state.shape === "sphere") {
    return { a: (a + 1) * Math.PI, b: clamp(b, -0.86, 0.86) };
  }
  return { a, b };
}

function particleVelocity(phase) {
  const dt = 0.0012;
  const p0 = particleParam(phase);
  const p1 = particleParam(phase + dt);

  const w0 = toWorld(state.shape, p0.a, p0.b);
  const w1 = toWorld(state.shape, p1.a, p1.b);

  return {
    x: (w1.x - w0.x) / dt,
    y: (w1.y - w0.y) / dt,
    z: (w1.z - w0.z) / dt
  };
}

function drawParticleLayer() {
  if (!state.layers.particle) {
    return;
  }

  const param = particleParam(state.particle.phase);
  const pWorld = toWorld(state.shape, param.a, param.b);
  const pScreen = project(rotate(pWorld));
  if (!pScreen) {
    return;
  }

  const v = particleVelocity(state.particle.phase);
  const speedScale = 0.12;
  const tipWorld = {
    x: pWorld.x + v.x * speedScale,
    y: pWorld.y + v.y * speedScale,
    z: pWorld.z + v.z * speedScale
  };
  const tipScreen = project(rotate(tipWorld));

  ctx.fillStyle = "#be123c";
  ctx.beginPath();
  ctx.arc(pScreen.x, pScreen.y, 8, 0, Math.PI * 2);
  ctx.fill();

  if (tipScreen) {
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(pScreen.x, pScreen.y);
    ctx.lineTo(tipScreen.x, tipScreen.y);
    ctx.stroke();
  }

  if (state.layers.velocityComponents && state.layers.coordinates) {
    drawVelocityComponents(pWorld, pScreen, v, param);
  }
}

function drawVelocityComponents(pWorld, pScreen, vWorld, param) {
  const frame = frameAxesAt(param.a, param.b);
  if (!frame) {
    return;
  }

  const basis = tangentBasis(state.shape, param.a, param.b);
  const c = Math.cos(state.coord.theta);
  const s = Math.sin(state.coord.theta);

  const bx = {
    x: c * basis.e1.x + s * basis.e2.x,
    y: c * basis.e1.y + s * basis.e2.y,
    z: c * basis.e1.z + s * basis.e2.z
  };
  const by = {
    x: -s * basis.e1.x + c * basis.e2.x,
    y: -s * basis.e1.y + c * basis.e2.y,
    z: -s * basis.e1.z + c * basis.e2.z
  };

  const vx = (vWorld.x * bx.x + vWorld.y * bx.y + vWorld.z * bx.z) / state.coord.sx;
  const vy = (vWorld.x * by.x + vWorld.y * by.y + vWorld.z * by.z) / state.coord.sy;

  const compScale = 0.11;
  const xCompTip = project(rotate({
    x: pWorld.x + bx.x * vx * compScale,
    y: pWorld.y + bx.y * vx * compScale,
    z: pWorld.z + bx.z * vx * compScale
  }));
  const yCompTip = project(rotate({
    x: pWorld.x + by.x * vy * compScale,
    y: pWorld.y + by.y * vy * compScale,
    z: pWorld.z + by.z * vy * compScale
  }));

  if (xCompTip) {
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(pScreen.x, pScreen.y);
    ctx.lineTo(xCompTip.x, xCompTip.y);
    ctx.stroke();
  }

  if (yCompTip) {
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(pScreen.x, pScreen.y);
    ctx.lineTo(yCompTip.x, yCompTip.y);
    ctx.stroke();
  }
}

function buildLayerControls() {
  layerControls.innerHTML = "";

  for (const layer of layerMeta) {
    const row = document.createElement("div");
    row.className = "layer-row";

    const title = document.createElement("div");
    title.innerHTML = `${layer.label}<br><small>${layer.note}</small>`;

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = !!state.layers[layer.id];
    toggle.disabled = !!layer.locked || !!layer.disabled;

    toggle.addEventListener("change", () => {
      state.layers[layer.id] = toggle.checked;
      if (!state.layers.coordinates) {
        state.layers.velocityComponents = false;
      }
      if (!state.layers.particle) {
        state.layers.velocityComponents = false;
      }
      syncLayerControls();
    });

    row.appendChild(title);
    row.appendChild(toggle);
    layerControls.appendChild(row);
  }
}

function syncLayerControls() {
  const checkboxes = layerControls.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((box, idx) => {
    const id = layerMeta[idx].id;
    box.checked = !!state.layers[id];
  });
}

function applyScene(sceneNo) {
  if (sceneNo === 1) {
    state.layers.points = false;
    state.layers.coordinates = false;
    state.layers.particle = false;
    state.layers.velocityComponents = false;
  }

  if (sceneNo === 2) {
    state.layers.points = true;
    state.layers.coordinates = false;
    state.layers.particle = false;
    state.layers.velocityComponents = false;
  }

  if (sceneNo === 3) {
    state.layers.points = true;
    state.layers.coordinates = true;
    state.layers.particle = false;
    state.layers.velocityComponents = false;
  }

  if (sceneNo === 4) {
    state.layers.points = true;
    state.layers.coordinates = true;
    state.layers.particle = true;
    state.layers.velocityComponents = true;
  }

  syncLayerControls();
}

function updateShapeButtons() {
  for (const btn of shapeButtons) {
    btn.classList.toggle("active", btn.dataset.shape === state.shape);
  }
}

function tick() {
  if (state.running) {
    state.time += 0.014;
    state.particle.phase += 0.012 * state.particle.speed;

    if (animateTransform.checked && state.layers.coordinates) {
      state.coord.a0 = 0.28 * Math.sin(0.35 * state.time);
      state.coord.b0 = 0.22 * Math.cos(0.29 * state.time);
      state.coord.theta = 1.1 * Math.sin(0.22 * state.time);
      state.coord.sx = 80 + 18 * Math.sin(0.19 * state.time);
      state.coord.sy = 66 + 14 * Math.cos(0.17 * state.time);

      if (state.shape === "sphere") {
        state.coord.a0 = (state.coord.a0 + 1) * Math.PI;
        state.coord.b0 = clamp(state.coord.b0, -0.86, 0.86);
      }
    }

    draw();
  }
  requestAnimationFrame(tick);
}

function draw() {
  drawBackdrop();

  if (state.layers.surface) {
    drawSurface();
  }
  drawPoints();
  drawCoordinateLayer();
  drawParticleLayer();
}

function initEvents() {
  canvas.addEventListener("pointerdown", (event) => {
    state.drag.active = true;
    state.drag.x = event.clientX;
    state.drag.y = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!state.drag.active) {
      return;
    }

    const dx = event.clientX - state.drag.x;
    const dy = event.clientY - state.drag.y;
    state.drag.x = event.clientX;
    state.drag.y = event.clientY;

    state.camera.yaw += dx * 0.008;
    state.camera.pitch = clamp(state.camera.pitch + dy * 0.006, -1.46, 1.46);
    draw();
  });

  canvas.addEventListener("pointerup", () => {
    state.drag.active = false;
  });

  canvas.addEventListener("pointercancel", () => {
    state.drag.active = false;
  });

  for (const btn of shapeButtons) {
    btn.addEventListener("click", () => {
      state.shape = btn.dataset.shape;
      updateShapeButtons();
      resetPoints();
      draw();
    });
  }

  for (const btn of sceneButtons) {
    btn.addEventListener("click", () => applyScene(Number(btn.dataset.scene)));
  }

  resetViewBtn.addEventListener("click", () => {
    state.camera.yaw = -0.58;
    state.camera.pitch = 0.3;
    draw();
  });
}

function init() {
  buildLayerControls();
  updateShapeButtons();
  resetPoints();
  applyScene(1);
  initEvents();
  draw();
  tick();
}

init();
