// Builds the fermenter figure (a jacketed stirred-tank bioreactor that comes apart).
// Run: node scripts/fermenter/build.mjs            -> components/fermenter/fermenter-art.ts + preview pages
//      node scripts/fermenter/build.mjs --audit    -> also proves the geometry (clearance, support, depth order)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../components/iso/kit/iso-kit.mjs";
import * as G from "../../components/iso/kit/lathe.mjs";
import { tubePieces, tubeSvg } from "../../components/iso/kit/tube.mjs";
import * as A from "../../components/iso/kit/audit.mjs";
import { MODEL, readoutAt } from "../../components/fermenter/model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const DEG = Math.PI / 180;

// ---------------------------------------------------------------- world
// 1 unit = 4 mm. z is up, the floor plate's top is z = 0.
const W = 620;
const H = 760;
const AZIMUTH = 45;
const ELEVATION = 30;

const PLATE = { x: -70, y: -70, w: 140, d: 140, r: 8 };
const PLATE_H = 8;
const FOOT_H = 5;

const R_IN = 35; // vessel inside radius: 280 mm bore
const R_SHELL = 36;
const R_JACKET = 40;
const Z_APEX = 34; // bottom of the 2:1 ellipsoidal head
const Z_TAN = 52; // tangent line, dish meets shell
const Z_JACKET = [60, 132];
const Z_RIM = 142; // top of the straight shell
const Z_FLANGE = 148; // top of the body flange = underside of the head plate
const Z_HEAD = 154; // top of the head plate
const Z_SEAL = 162; // top of the seal housing
const LUG_Z = [63, 73];
const LEG_R = 44;
const LEG_AT = [-10, 80, 170, 260]; // turned off the diagonal so the far legs do not hide behind the near ones

const SHAFT_R = 2.2;
const BORE = 2.3;
const TURBINE_Z = [60, 95];
const DI = 23.4; // impeller diameter, a third of the bore
const RI = DI / 2;

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [0, 0, Z_SEAL + 112 + 44],
    [-62, 62, 240 + 126 + 2],
    [-62 + 14, 62 - 14, 162 + 126],
    [-62 - 14, 62 + 14, 162 + 126],
    [70, 70, 80],
  ],
  W,
  H,
  { pad: 22, azimuth: AZIMUTH, elevation: ELEVATION },
);
const V = G.viewOf(P);
const KS = G.scaleOf(P);
const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const Faded = (list, style) => k.fadedSvg(list, style);
const FADE = [0.04, 0.42];

const dir = (deg) => [Math.cos(deg * DEG), Math.sin(deg * DEG), 0];
const polar = (deg, r, z) => [r * Math.cos(deg * DEG), r * Math.sin(deg * DEG), z];
const UP = [0, 0, 1];
const AXIS = G.frameOf([0, 0, 0], UP, [1, 0, 0], [0, 1, 0]);
const vertical = (x, y) => G.frameOf([x, y, 0], UP, [1, 0, 0], [0, 1, 0]);
// a frame whose axis points out from the vessel at `deg`, with v along z, for parts on the round wall
const radialFrame = (deg, r, z) => G.frameOf(polar(deg, r, z), dir(deg), dir(deg + 90), UP);
// a frame standing up on the axis whose u points out at `deg`: polygons in (radial, tangential), s is z
const upFrame = (deg) => G.frameOf([0, 0, 0], UP, dir(deg), dir(deg + 90));

// ---------------------------------------------------------------- assemblies
const PIECES = {
  drive: { name: "Drive: motor, gearbox and lantern", move: [-62, 62, 126] }, // always above the rising head plate
  head: { name: "Head plate: gas, feeds and exhaust", move: [0, 0, 112] },
  agitator: { name: "Agitator: shaft and two Rushton turbines", move: [0, 0, 112] },
  ph: { name: "pH probe", move: G.mul3(dir(15), 26) },
  dox: { name: "Dissolved-oxygen probe", move: G.mul3(dir(45), 26) },
  temp: { name: "Temperature probe", move: G.mul3(dir(75), 26) },
  vessel: { name: "Vessel and water jacket", move: [0, 0, 0] },
  controller: { name: "Controller: the loops that hold it", move: [0, 0, 0] },
  stand: { name: "Stand", move: [0, 0, 0] },
};
const STAGGER = ["drive", "head", "agitator", "ph", "dox", "temp", "vessel", "controller", "stand"];
const SPRING = { stagger: 0.045, stiffness: 52, damping: 13, substeps: 4 };

const R = A.recorder(P, { order: STAGGER, spring: SPRING });
const { items, nameFor } = R;
const record = R.solid;

function put(piece, ref, svg, { bias = 0, ride, shapes = [], name, route, chunk, key } = {}) {
  const rider = ride ?? piece;
  R.put({ piece, ride: rider, at: ref, bias, svg, move: PIECES[rider].move, shapes, name: name ?? nameFor(`${piece}.item`), route, chunk, ...(key !== undefined ? { key } : {}) });
}

function turned(piece, F, profile, style = {}, { extra = "", inner = "", bias = 0, ride, bevel = 0, steps, name, owner, smooth = profile.some((p) => p[2]), shape } = {}) {
  const paths = G.solidOf(profile, F, P, { bevel, smooth: smooth === true ? { rows: 3 } : smooth, ...(steps ? { steps } : {}) });
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const id = nameFor(name ?? `${piece}.turned`);
  const recorded = record(shape ?? A.solid(F, profile, { name: id, owner, curve: smooth && !smooth.slope ? profile : undefined }));
  put(piece, G.add3(F.o, G.mul3(F.a, mid)), S(paths, { tone: "hi", ...style, inner: inner ? Ln(inner, { tone: "faint" }) : "" }) + extra, { bias, ride, name: id, shapes: [recorded] });
  return recorded;
}

function discAt(piece, F, s0, s1, r, style = {}, options = {}) {
  return turned(piece, F, [[s0, r], [s1, r]], style, options);
}

// A hollow ring: fill is the hull with the top bore punched out (even-odd), recorded as a ring.
function ringAt(piece, F, s0, s1, rIn, rOut, style = {}, { extra = "", inner = "", bias = 0, ride, name, owner, bevel = 0 } = {}) {
  const top = G.dot3(F.a, V) > 0 ? s1 : s0;
  const paths = G.ringBand(s0, s1, rIn, rOut, F, P, { hole: [top, rIn], bevel });
  const id = nameFor(name ?? `${piece}.ring`);
  const shape = record(A.ring(F, s0, s1, rIn, rOut, { name: id, owner }));
  put(piece, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), S(paths, { tone: "hi", ...style, className: "fm-hollow", inner: inner ? Ln(inner, { tone: "faint" }) : "" }) + extra, { bias, ride, name: id, shapes: [shape] });
  return shape;
}

// A band of the vessel wall. It is drawn whole (outer wall and top annulus, bore open), but only its
// near half is recorded: the far half's inside is the dark void in the back layer, so the agitator
// inside the vessel orders cleanly behind the near wall and shows through the opening.
const NEAR = [-60, 150]; // the near half, cut every 10° so a sector edge falls on each near lug (-10°, 80°)
function wallAt(name, s0, s1, rIn, rOut, { extra = "", inner = "", bevel = 0, tone = "hi" } = {}) {
  const top = s1;
  const paths = G.ringBand(s0, s1, rIn, rOut, AXIS, P, { hole: [top, rIn], bevel });
  const sectors = 21;
  const shapes = Array.from({ length: sectors }, (_, i) => {
    const a0 = (NEAR[0] + ((NEAR[1] - NEAR[0]) * i) / sectors) * DEG;
    const a1 = (NEAR[0] + ((NEAR[1] - NEAR[0]) * (i + 1)) / sectors) * DEG;
    const quad = [
      [rIn * Math.cos(a0), rIn * Math.sin(a0)],
      [rOut * Math.cos(a0), rOut * Math.sin(a0)],
      [rOut * Math.cos(a1), rOut * Math.sin(a1)],
      [rIn * Math.cos(a1), rIn * Math.sin(a1)],
    ];
    return record(A.prism(AXIS, quad, s0, s1, { name, owner: name }));
  });
  put("vessel", [0, 0, (s0 + s1) / 2], S(paths, { tone, className: "fm-hollow", inner: inner ? Ln(inner, { tone: "faint" }) : "" }) + extra, { name, shapes });
}

function boxAt(piece, plan, z, h, style = {}, { extra = "", bias = 0, ride, bevel = 0.5, steps = 3, name, owner, inner = "" } = {}) {
  const centre = [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2];
  const id = nameFor(name ?? `${piece}.box`);
  const shape = record(A.box([plan.x, plan.y, z], [plan.x + plan.w, plan.y + plan.d, z + h], { name: id, owner }));
  put(piece, centre, S(k.slabOf(plan, z, h, P, steps, bevel), { tone: "hi", ...style, inner }) + extra, { bias, ride, name: id, shapes: [shape] });
  return shape;
}

function prismAt(piece, F, polygon, s0, s1, style = {}, { extra = "", bias = 0, ride, name, owner } = {}) {
  const id = nameFor(name ?? `${piece}.prism`);
  const shape = record(A.prism(F, polygon, s0, s1, { name: id, owner }));
  const cx = polygon.reduce((sum, p) => sum + p[0], 0) / polygon.length;
  const cy = polygon.reduce((sum, p) => sum + p[1], 0) / polygon.length;
  const centre = G.add3(G.add3(G.add3(F.o, G.mul3(F.u, cx)), G.mul3(F.v, cy)), G.mul3(F.a, (s0 + s1) / 2));
  put(piece, centre, S(G.prismOf(F, polygon, s0, s1, P), { tone: "hi", ...style }) + extra, { bias, ride, name: id, shapes: [shape] });
  return shape;
}

// A saddle pad on the round jacket: its base follows the cylinder, its face is flat.
function padOnJacket(piece, deg, z, a, h, { name, ring = true } = {}) {
  const F = radialFrame(deg, 0, z);
  const id = nameFor(name ?? `${piece}.pad`);
  const host = A.disc(AXIS, Z_JACKET[0], Z_JACKET[1], R_JACKET, { name: "vessel.jacket", piece: "vessel", ride: "vessel", move: [0, 0, 0] });
  const face = R_JACKET + h;
  const low = Math.sqrt(R_JACKET ** 2 - a ** 2);
  const ringLine = ring ? Ln(G.circleOf(F, face, a * 0.55, P, 20), { tone: "faint" }) : "";
  put(piece, G.add3(F.o, G.mul3(F.a, (low + face) / 2)), S(G.saddleOf(F, a, R_JACKET, face, P), { tone: "hi" }) + ringLine, {
    bias: 0.1,
    name: id,
    shapes: [record(A.disc(F, low - 0.05, face, a, { name: id, seated: true, cut: [host] }))],
  });
  return { F, face };
}

function tubeItems(piece, route, r, { name, tone = "hi", bias = 0, ride, maxLength = 16, spacing = 1, gaps = [], caps = true, rims, free = [false, false], ends = [true, true], owner } = {}) {
  const id = nameFor(name ?? `${piece}.tube`);
  const rider = ride ?? piece;
  R.route(id, route, r, { owner: owner ?? id, gaps, rims, free, ends, piece, move: PIECES[rider].move, ride: rider });
  tubePieces(route, r, P, { maxLength, spacing, gaps, caps }).forEach((part, index) =>
    put(piece, part.mid, tubeSvg(part, { tone }), { bias, ride, name: `${id}:${index}`, route: id, chunk: index, shapes: [A.tube(part.points, part.radii)] }),
  );
  return id;
}

function flangeAt(piece, centre, axis, r, thick, { bolts = 6, tone = "hi", name, owner, ride } = {}) {
  const F = G.frameAlong(centre, axis);
  const id = nameFor(name ?? `${piece}.flange`);
  const towards = G.dot3(F.a, V) > 0 ? thick / 2 : -thick / 2;
  const face = Math.abs(G.dot3(F.a, V)) > 0.12 && bolts ? Dots(G.dotsOf(F, towards, r * 0.72, bolts, P, { all: true }), { size: 0.38, tone: "mid" }) : "";
  put(piece, centre, S(G.disc(-thick / 2, thick / 2, r, F, P), { tone }) + face, { ride, name: id, shapes: [record(A.disc(F, -thick / 2, thick / 2, r, { name: id, owner }))] });
}

// A short line: flanged on its port, gapped under its fittings, ending in a hose coupling.
function pipe(piece, control, r, { bend = 2.6, flangeR = 1.7, valve = null, name, tone = "hi", maxLength = 14 } = {}) {
  const line = G.fillet(control, Math.max(r * bend, 3), 12, { P, tube: r });
  const total = G.pathLength(line);
  const id = nameFor(name ?? `${piece}.pipe`);
  const thick = Math.max(0.9, r * 0.55);
  const couple = Math.max(1.8, r * 1.4);
  const gaps = [[0, thick], [total - couple, total]];
  if (valve) gaps.push([valve * total - r * 2.4, valve * total + r * 2.4]);
  // the far end is a hose coupling: open by design, a hose would land there
  tubeItems(piece, line, r, { name: id, tone, maxLength, spacing: Math.max(0.8, r * 0.3), gaps, rims: [r * flangeR, r * 1.5], owner: id, free: [false, true], ends: [true, false] });
  const t0 = G.tangentAlong(line, 0);
  flangeAt(piece, G.add3(line[0], G.mul3(t0, thick / 2)), t0, r * flangeR, thick, { bolts: 4, name: `${id}.flange`, owner: id });
  const t1 = G.tangentAlong(line, total);
  const end = line[line.length - 1];
  const CF = G.frameAlong(G.add3(end, G.mul3(t1, -couple / 2)), t1);
  put(piece, CF.o, S(G.disc(-couple / 2, couple / 2, r * 1.5, CF, P, { bevel: 0.25 }), { tone: "mid" }) + (G.dot3(t1, V) > 0.2 ? Ln(G.circleOf(CF, couple / 2, r * 0.8, P, 16), { tone: "faint" }) : ""), {
    name: `${id}.coupling`,
    shapes: [record(A.disc(CF, -couple / 2, couple / 2, r * 1.5, { name: `${id}.coupling`, owner: id }))],
  });
  if (valve) valveOn(piece, line, valve, r, { owner: id, name: `${id}.valve` });
  return line;
}

function valveOn(piece, line, share, r, { owner, name, side = UP } = {}) {
  const total = G.pathLength(line);
  const along = total * share;
  const centre = G.pointAlong(line, along);
  const tangent = G.tangentAlong(line, along);
  const F = G.frameAlong(centre, tangent);
  const crown = r * 2;
  const base = r * 1.45;
  const half = r * 1.6;
  const bulge = (x) => base + (crown - base) * Math.sqrt(Math.max(0, 1 - (x / half) ** 2));
  const bulgeSlope = (x) => {
    if (Math.abs(x) >= half - 1e-9) return 0;
    const t = Math.max(-0.995, Math.min(0.995, x / half));
    return (-(crown - base) * t) / (half * Math.sqrt(1 - t * t));
  };
  const meridian = [
    [-r * 2.4, 0],
    [-r * 2.4, base],
    ...Array.from({ length: 17 }, (_, i) => {
      const x = half * Math.sin(((i - 8) / 8) * (Math.PI / 2));
      return [x, bulge(x), i && i < 16 ? 1 : 0];
    }),
    [r * 2.4, base],
    [r * 2.4, 0],
  ];
  put(piece, centre, S(G.lathe(meridian, F, P, { steps: 36, smooth: { slope: bulgeSlope, rows: 3 } }), { tone: "hi" }) + Dots([...G.dotsOf(F, -r * 2.4, r * 1.15, 6, P, { all: true }), ...G.dotsOf(F, r * 2.4, r * 1.15, 6, P, { all: true })].filter((_, i) => i % 2 === 0), { size: 0.36, tone: "mid" }), {
    name,
    shapes: [record(A.body(F, meridian, { name, owner }))],
  });
  const up = G.unit3(side);
  const NF = G.frameAlong(centre, up);
  const s0 = crown - 0.25;
  const s1 = crown + r * 1.2;
  put(piece, G.add3(centre, G.mul3(up, (s0 + s1) / 2)), S(G.disc(s0, s1, r * 0.5, NF, P), { tone: "hi" }), { bias: 0.2, name: `${name}.neck`, shapes: [record(A.disc(NF, s0, s1, r * 0.5, { name: `${name}.neck`, owner }))] });
  // a hand wheel lying flat on the neck
  const w0 = s1;
  const w1 = s1 + 0.9;
  put(piece, G.add3(centre, G.mul3(up, (w0 + w1) / 2)), S(G.disc(w0, w1, r * 1.9, NF, P, { bevel: 0.2 }), { tone: "mid" }) + Dots([at(G.add3(centre, G.mul3(up, w1)))], { size: 0.45, tone: "hi" }), {
    bias: 0.3,
    name: `${name}.wheel`,
    shapes: [record(A.disc(NF, w0, w1, r * 1.9, { name: `${name}.wheel`, owner }))],
  });
}

// ================================================================= stand (static, behind everything that moves)
const back = [];
back.push(`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`);
const FEET = k.corners(PLATE, 12).sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
for (const [x, y] of FEET) {
  back.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
  back.push(S(k.cylinder(x, y, 5.2, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
}
back.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid" }));
record(A.slab(PLATE, -PLATE_H, PLATE_H, { name: "stand.plate" }));
back.push(Ln(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
const SCREWS = k.corners(PLATE, 10);
back.push(Ln(SCREWS.map(([x, y]) => k.ring(x, y, 2.4, 0, P, 18)).join(""), { tone: "lo" }));
back.push(Dots(SCREWS.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
// ruler strip along the front-left edge, ticks every 5 units (20 mm), majors every 25 (100 mm)
const STRIP = { x: -52, y: PLATE.y + PLATE.d - 13, w: 92, d: 6, r: 1 };
back.push(S(k.slabOf(STRIP, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
const TICKS = k.topTicks(STRIP.x + 3, STRIP.x + STRIP.w - 3, 5, 5, STRIP.y + 0.6, 0.6, [1.8, 3.6], P);
back.push(Ln(TICKS.minor, { tone: "lo" }) + Ln(TICKS.major, { tone: "mid" }));
// label plate on the front-right edge
const LABEL = { x: PLATE.x + PLATE.w - 13, y: -40, w: 8, d: 44, r: 1.2 };
back.push(S(k.slabOf(LABEL, 0, 0.8, P, 4), { tone: "lo" }));
back.push(Ln(k.planOutline(k.insetPlan(LABEL, 1.2), 0.8, P, 3), { tone: "faint" }));
back.push(
  Ln(
    [
      [LABEL.x + 2.6, LABEL.y + 5, LABEL.y + 30],
      [LABEL.x + 4.2, LABEL.y + 5, LABEL.y + 38],
      [LABEL.x + 5.8, LABEL.y + 5, LABEL.y + 22],
    ]
      .map(([x, y0, y1]) => k.lineOnTop([x, y0], [x, y1], 0.8, P))
      .join(""),
    { tone: "lo", free: true },
  ),
);
back.push(Dots([at([LABEL.x + LABEL.w / 2, LABEL.y + 2.4, 0.8]), at([LABEL.x + LABEL.w / 2, LABEL.y + LABEL.d - 2.4, 0.8])], { size: 0.42 }));

// legs: levelling pad, screw, tube, up to a lug welded on the jacket
for (const deg of LEG_AT) {
  const [x, y] = polar(deg, LEG_R, 0);
  const id = `stand.leg${deg}`;
  put("stand", [x, y, 1], S(k.cylinder(x, y, 5, 0, 2, P, 28, 0.4), { tone: "mid" }), { name: `${id}.pad`, shapes: [record(A.cylinder(x, y, 5, 0, 2, { name: `${id}.pad`, owner: id }))] });
  put("stand", [x, y, 4], S(k.cylinder(x, y, 1.6, 2, 4, P, 18), { tone: "mid" }) + Ln(k.knurl(x, y, 1.6, 2.4, 5.6, 10, P), { tone: "lo" }), { name: `${id}.screw`, shapes: [record(A.cylinder(x, y, 1.6, 2, 4, { name: `${id}.screw`, owner: id }))] });
  put("stand", [x, y, 7], S(k.cylinder(x, y, 2.8, 6, 2, P, 24), { tone: "mid" }), { name: `${id}.nut`, shapes: [record(A.cylinder(x, y, 2.8, 6, 2, { name: `${id}.nut`, owner: id }))] });
  const top = LUG_Z[0];
  put("stand", [x, y, (8 + top) / 2], S(k.cylinder(x, y, 2.6, 8, top - 8, P, 24), { tone: "mid" }) + Ln(k.sideArc(x, y, 2.6, 30, P, 14), { tone: "faint" }), { name: `${id}.tube`, shapes: [record(A.cylinder(x, y, 2.6, 8, top - 8, { name: `${id}.tube`, owner: id }))] });
}

// ================================================================= vessel
const dishR = (s) => R_SHELL * Math.sqrt(Math.max(0, 1 - ((Z_TAN - s) / (Z_TAN - Z_APEX)) ** 2));
const dishSlope = (s) => {
  const u = (Z_TAN - s) / (Z_TAN - Z_APEX);
  const c = Math.max(1e-3, Math.sqrt(Math.max(1e-6, 1 - u * u)));
  return (R_SHELL * u) / ((Z_TAN - Z_APEX) * c);
};
const DISH = Array.from({ length: 25 }, (_, i) => {
  const t = i / 24;
  const s = Z_APEX + (Z_TAN - Z_APEX) * (1 - Math.cos((t * Math.PI) / 2));
  return [s, dishR(s), i && i < 24 ? 1 : 0];
});
DISH[0] = [Z_APEX, 0];
const dishInner = DISH.map(([s, r]) => [s, Math.max(0, r - 1)]);
turned("vessel", AXIS, DISH, {}, {
  name: "vessel.dish",
  smooth: { slope: dishSlope, radius: dishR },
  shape: A.body(AXIS, [...DISH.map(([s, r]) => [s, r]), ...dishInner.slice().reverse().map(([s, r]) => [s + 1, r])], { name: "vessel.dish" }),
});
// drain boss under the apex and the harvest line with its valve
discAt("vessel", AXIS, Z_APEX - 4, Z_APEX, 3.2, {}, { name: "vessel.drain-boss" });
pipe("vessel", [[0, 0, Z_APEX - 4], [0, 0, 14], polar(45, 18, 14), polar(45, 40, 14)], 1.7, { valve: 0.62, name: "vessel.harvest" });

wallAt("vessel.shell-low", Z_TAN, Z_JACKET[0], R_IN, R_SHELL);
// a dimple jacket: staggered rows of pressed dimples between the two girth seams, fading toward the limbs
const DIMPLES = [];
for (let s = 82, row = 0; s <= 111; s += 5.8, row++) DIMPLES.push(...G.dotsOf(AXIS, s, R_JACKET, 30, P, { fade: FADE, phase: (row % 2) * (Math.PI / 30) }));
wallAt("vessel.jacket", Z_JACKET[0], Z_JACKET[1], R_SHELL, R_JACKET, { inner: [76, 116].map((s) => G.arcOf(AXIS, s, R_JACKET, P)).join(""), extra: Dots(DIMPLES, { size: 0.42, tone: "lo" }) });
wallAt("vessel.shell-high", Z_JACKET[1], Z_RIM, R_IN, R_SHELL);
wallAt("vessel.flange", Z_RIM, Z_FLANGE, R_IN, 46, { bevel: 0.6, inner: G.arcOf(AXIS, Z_RIM + 3, 46, P) });
// the open vessel: dark inside the bore. It sits in the back layer, under everything that moves,
// so the agitator shows through the opening while the near wall still hides it.
back.push(`<path class="fm-void" d="${G.circleOf(AXIS, Z_FLANGE, R_IN, P, 96)}"/>` + Ln(G.arcOf(AXIS, Z_FLANGE - 9, R_IN, P, { inward: true }), { tone: "faint" }));

// lugs the legs carry
for (const deg of LEG_AT) {
  const F = upFrame(deg);
  const id = `vessel.lug${deg}`;
  // the lug's inner face is tangent to the jacket on its centre line
  const bolt = Dots([at(polar(deg, LEG_R, LUG_Z[1]))], { size: 0.5, tone: "mid" }) + Ln(k.ring(...polar(deg, LEG_R, 0).slice(0, 2), 1.4, LUG_Z[1], P, 14), { tone: "lo" });
  prismAt("vessel", F, [[R_JACKET, -3], [LEG_R + 4, -3], [LEG_R + 4, 3], [R_JACKET, 3]], LUG_Z[0], LUG_Z[1], {}, { name: id, extra: bolt });
}

// jacket water: in at the bottom, out at the top, both on the right
const WATER = [
  { deg: -50, z: 68, name: "vessel.water-in" },
  { deg: -50, z: 124, name: "vessel.water-out" },
];
for (const { deg, z, name } of WATER) {
  const pad = padOnJacket("vessel", deg, z, 3.6, 2.4, { name: `${name}.pad`, ring: false });
  const start = G.pointOf(pad.F, pad.face, 0, 0);
  pipe("vessel", [start, G.add3(start, G.mul3(dir(deg), 14))], 2, { name });
}

// sample valve low on the left
{
  const pad = padOnJacket("vessel", 100, 70, 3, 2, { name: "vessel.sample-pad", ring: false });
  const start = G.pointOf(pad.F, pad.face, 0, 0);
  pipe("vessel", [start, G.add3(start, G.mul3(dir(100), 18))], 1.3, { valve: 0.55, name: "vessel.sample" });
}

// ================================================================= probes in side ports
const PROBES = [
  { id: "ph", deg: 15, length: 22, head: 3.2 },
  { id: "dox", deg: 45, length: 18, head: 3.6 },
  { id: "temp", deg: 75, length: 13, head: 2.6 },
];
const PROBE_Z = 100; // below the 18 L liquid line at z = 113
for (const { id, deg, length, head } of PROBES) {
  const pad = padOnJacket("vessel", deg, PROBE_Z, 3.8, 3, { name: `vessel.port-${id}`, ring: false });
  const F = pad.F;
  let s = pad.face;
  discAt(id, F, s, s + 2.6, 4.2, { tone: "mid" }, { name: `${id}.nut`, extra: Faded(G.ribsOf(F, s, s + 2.6, 4.2, 18, P, { fade: [0.1, 0.55] }), { tone: "lo" }) });
  s += 2.6;
  discAt(id, F, s, s + length, 1.9, {}, { name: `${id}.body`, inner: G.arcOf(F, s + length * 0.55, 1.9, P) });
  s += length;
  discAt(id, F, s, s + 1.4, 2.4, { tone: "mid" }, { name: `${id}.collar` });
  s += 1.4;
  discAt(id, F, s, s + 5, head, {}, { name: `${id}.head`, inner: G.arcOf(F, s + 2.5, head, P), extra: Ln(G.circleOf(F, s + 5, head * 0.55, P, 20), { tone: "faint" }) + Dots([at(G.pointOf(F, s + 5, 0, 0))], { size: 0.5, tone: "mid" }) });
}

// ================================================================= head plate (the agitator hangs from it)
// the shaft runs on up through the seal, out of sight; the drawing stops it at the plate's underside
discAt("head", AXIS, Z_FLANGE, Z_HEAD, 46, {}, {
  name: "head.plate",
  bevel: 0.8,
  extra: Dots(G.dotsOf(AXIS, Z_HEAD, 42.6, 16, P, { all: true }), { size: 0.5, tone: "mid" }),
});
discAt("head", AXIS, Z_HEAD, Z_HEAD + 2, 9.5, { tone: "mid" }, { name: "head.seal-flange", extra: Dots(G.dotsOf(AXIS, Z_HEAD + 2, 8, 6, P, { all: true }), { size: 0.4, tone: "mid" }) });
discAt("head", AXIS, Z_HEAD + 2, Z_SEAL, 6.6, {}, { name: "head.seal", inner: G.arcOf(AXIS, Z_HEAD + 5, 6.6, P), bevel: 0.4, extra: Ln(G.circleOf(AXIS, Z_SEAL, BORE, P, 20), { tone: "lo" }) + Dots([at([0, 0, Z_SEAL])], { size: 0.5, tone: "mid" }) });

// a boss standing on the head plate's top face
const onHead = (deg, r) => vertical(...polar(deg, r, 0).slice(0, 2));
function headStack(deg, r, stack, name) {
  const F = onHead(deg, r);
  let z = Z_HEAD;
  stack.forEach(([h, rad, opts = {}], i) => {
    discAt("head", F, z, z + h, rad, opts.style ?? {}, { name: `${name}.${i}`, owner: name, bevel: opts.bevel ?? 0, inner: opts.inner ? opts.inner(F, z, h, rad) : "", extra: opts.extra ? opts.extra(F, z, h, rad) : "" });
    z += h;
  });
  return { F, top: z };
}
const ribs = (count) => (F, z, h, rad) => Faded(G.ribsOf(F, z, z + h, rad, count, P, { fade: [0.1, 0.55] }), { tone: "lo" });
const seam = (share) => (F, z, h, rad) => G.arcOf(F, z + h * share, rad, P);
const faceRing = (scale) => (F, z, h, rad) => Ln(G.circleOf(F, z + h, rad * scale, P, 24), { tone: "faint" });

// exhaust: condenser with cooling fins, then a sterile filter
headStack(-45, 28, [
  [2, 4.6, { style: { tone: "mid" } }],
  [3, 3.4],
  [20, 5, { extra: (F, z, h, rad) => Faded(G.ribsOf(F, z + 1.5, z + h - 1.5, rad, 22, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }) }],
  [2, 3.4],
  [13, 6.2, { inner: seam(0.5), bevel: 0.5 }],
  [3, 2.6, { style: { tone: "mid" }, extra: faceRing(0.5) }],
], "head.exhaust");
// pressure gauge, face up
{
  const { F, top } = headStack(240, 30, [
    [2, 2.6, { style: { tone: "mid" } }],
    [7, 1.2],
  ], "head.gauge-stem");
  const [gx, gy] = polar(240, 30, 0);
  const G0 = top;
  // a 0–2 bar dial over 270°, ticks every 0.05 bar, needle at the head pressure
  const t = k.radialTicks(gx, gy, 6.2, 40, 5, G0 + 5, [0.9, 1.9], P, -0.75 * Math.PI, 1.5 * Math.PI);
  const a = -0.75 * Math.PI + (MODEL.headBar / 2) * 1.5 * Math.PI;
  const needle = k.lineOnTop([gx - Math.sin(a) * 1.2, gy + Math.cos(a) * 1.2], [gx + Math.sin(a) * 4.8, gy - Math.cos(a) * 4.8], G0 + 5, P);
  const face = Ln(k.ring(gx, gy, 6.2, G0 + 5, P, 48), { tone: "lo" }) + Ln(t.minor, { tone: "lo" }) + Ln(t.major, { tone: "mid" }) + Ln(needle, { tone: "hi", free: "end" }) + Dots([at([gx, gy, G0 + 5])], { size: 0.6, tone: "hi" });
  put("head", [gx, gy, G0 + 2.5], S(k.cylinder(gx, gy, 7.4, G0, 5, P, 56, 0.5), { tone: "hi" }) + face, {
    name: "head.gauge",
    shapes: [record(A.cylinder(gx, gy, 7.4, G0, 5, { name: "head.gauge", owner: "head.gauge-stem" }))],
  });
}
// air inlet filter
headStack(195, 31, [
  [2, 3.6, { style: { tone: "mid" } }],
  [16, 4.6, { inner: seam(0.62), bevel: 0.4 }],
  [3, 2.4, { style: { tone: "mid" }, extra: faceRing(0.5) }],
], "head.air-filter");
// inoculation port with a knurled cap
headStack(160, 17, [
  [4, 3.8],
  [3, 4.4, { style: { tone: "mid" }, extra: (F, z, h, rad) => Ln(k.knurl(F.o[0], F.o[1], rad, z + 0.4, z + h - 0.4, 26, P), { tone: "lo" }) + faceRing(0.5)(F, z, h, rad) }],
], "head.inoculum");
// acid, base and antifoam addition ports with septum caps
for (const [i, deg] of [100, 118, 136].entries()) {
  headStack(deg, 31, [
    [4, 2.2],
    [2, 2.8, { style: { tone: "mid" }, extra: faceRing(0.45) }],
  ], `head.feed${i}`);
}
// sight glass
{
  const F = onHead(15, 27);
  // a bolted ring with the glass flush in its bore
  const top = Z_HEAD + 2;
  const glass = `<path class="fm-glass" d="${G.circleOf(F, top, 3.6, P, 32)}"/>` + Ln(G.circleOf(F, top, 3.6, P, 32), { tone: "lo" }) + Ln(k.lineOnTop([F.o[0] - 1.6, F.o[1] - 0.6], [F.o[0] + 0.4, F.o[1] + 1.6], top, P), { tone: "faint", free: true });
  discAt("head", F, Z_HEAD, top, 6, { tone: "mid" }, { name: "head.sight-glass", extra: glass + Dots(G.dotsOf(F, top, 4.8, 6, P, { all: true }), { size: 0.36 }) });
}

// ================================================================= agitator (rides the head)
const AG = { ride: "head" };
const HUB = 2.2;
const DISC_T = 0.3;
// the shaft is cut at every hub, so each run orders cleanly against the hubs it meets
const SHAFT_FOOT = 56;
const shaftStops = [SHAFT_FOOT + 2];
for (const z of TURBINE_Z) shaftStops.push(z - HUB, z + HUB);
shaftStops.push(Z_FLANGE);
for (let i = 0; i < shaftStops.length; i += 2) {
  const [s0, s1] = [shaftStops[i], shaftStops[i + 1]];
  const id = nameFor("agitator.shaft");
  put("agitator", [0, 0, (s0 + s1) / 2], S(G.disc(s0, s1, SHAFT_R, AXIS, P), { tone: "hi" }), {
    ...AG,
    name: id,
    shapes: [record(A.disc(AXIS, s0, s1, SHAFT_R, { name: id, owner: "agitator" }))],
  });
}
discAt("agitator", AXIS, SHAFT_FOOT, SHAFT_FOOT + 2, 2.9, { tone: "mid" }, { ...AG, name: "agitator.end-nut", owner: "agitator" });
for (const [t, z] of TURBINE_Z.entries()) {
  const owner = "agitator";
  discAt("agitator", AXIS, z - HUB, z - DISC_T, 3.4, { tone: "mid" }, { ...AG, name: `agitator.hub${t}-low`, owner });
  discAt("agitator", AXIS, z - DISC_T, z + DISC_T, RI * 0.75, {}, { ...AG, name: `agitator.disc${t}`, owner });
  discAt("agitator", AXIS, z + DISC_T, z + HUB, 3.4, { tone: "mid" }, { ...AG, name: `agitator.hub${t}-high`, owner, extra: Dots(G.dotsOf(AXIS, z + HUB, 2.8, 2, P, { all: true, phase: 0.3 }), { size: 0.4 }) });
  for (let b = 0; b < 6; b++) {
    const deg = b * 60 + 10;
    const F = G.frameOf([0, 0, 0], UP, dir(deg), dir(deg + 90));
    const blade = [[RI - DI / 4, -0.25], [RI, -0.25], [RI, 0.25], [RI - DI / 4, 0.25]];
    prismAt("agitator", F, blade, z + DISC_T, z + DI / 10, {}, { ...AG, name: `agitator.blade${t}-${b}-up`, owner });
    prismAt("agitator", F, blade, z - DI / 10, z - DISC_T, {}, { ...AG, name: `agitator.blade${t}-${b}-down`, owner });
  }
}

// ================================================================= drive: lantern, coupling, gearbox, motor
const LANTERN = [Z_SEAL, Z_SEAL + 3, Z_SEAL + 21, Z_SEAL + 24];
discAt("drive", AXIS, LANTERN[0], LANTERN[1], 12, { tone: "mid" }, { name: "drive.base", extra: Dots(G.dotsOf(AXIS, LANTERN[1], 10.4, 4, P, { all: true, phase: 0.8 }), { size: 0.45 }) });
for (const deg of [30, 150, 270]) {
  const [x, y] = polar(deg, 9.4, 0);
  put("drive", [x, y, (LANTERN[1] + LANTERN[2]) / 2], S(k.cylinder(x, y, 1.5, LANTERN[1], LANTERN[2] - LANTERN[1], P, 16), { tone: "mid" }), { name: `drive.post${deg}`, shapes: [record(A.cylinder(x, y, 1.5, LANTERN[1], LANTERN[2] - LANTERN[1], { name: `drive.post${deg}`, owner: "drive.lantern" }))] });
}
discAt("drive", AXIS, LANTERN[1], LANTERN[1] + 7, 4.4, {}, { name: "drive.coupling", inner: G.arcOf(AXIS, LANTERN[1] + 3.5, 4.4, P), extra: Dots(G.dotsOf(AXIS, LANTERN[1] + 1.8, 4.4, 6, P, { fade: FADE }), { size: 0.38 }) });
discAt("drive", AXIS, LANTERN[1] + 7, LANTERN[2], 2, {}, { name: "drive.output-shaft" });
discAt("drive", AXIS, LANTERN[2], LANTERN[3], 12, { tone: "mid" }, { name: "drive.top-flange", bevel: 0.4 });
const GB = { x: -12, y: -12, w: 24, d: 24, r: 2.4 };
const GB_Z = [LANTERN[3], LANTERN[3] + 16];
boxAt("drive", GB, GB_Z[0], GB_Z[1] - GB_Z[0], {}, {
  name: "drive.gearbox",
  bevel: 0.6,
  steps: 4,
  inner: Ln(k.sideSeam(GB, GB_Z[0] + 8, P, 4), { tone: "faint" }),
  extra: Dots(k.corners(GB, 3).map(([x, y]) => at([x, y, GB_Z[1]])), { size: 0.5 }) + Ln(k.planOutline(k.insetPlan(GB, 1.6), GB_Z[1], P, 3), { tone: "faint" }),
});
const MOTOR = [GB_Z[1], GB_Z[1] + 28];
discAt("drive", AXIS, MOTOR[0], MOTOR[0] + 2, 7, { tone: "mid" }, { name: "drive.motor-spigot" });
discAt("drive", AXIS, MOTOR[0] + 2, MOTOR[1], 10, {}, {
  name: "drive.motor",
  extra: Faded(G.ribsOf(AXIS, MOTOR[0] + 4, MOTOR[1] - 3, 10, 28, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }),
});
const cowl = (s) => 10 - 3.4 * ((s - MOTOR[1]) / 8) ** 2;
const cowlSlope = (s) => (-6.8 * (s - MOTOR[1])) / 64;
const COWL = Array.from({ length: 13 }, (_, i) => {
  const s = MOTOR[1] + (8 * i) / 12;
  return [s, cowl(s), i && i < 12 ? 1 : 0];
});
turned("drive", AXIS, [...COWL, [MOTOR[1] + 8, 0]], {}, {
  name: "drive.cowl",
  smooth: { slope: cowlSlope, rows: 3 },
  extra: Ln([1.6, 3.2, 4.8].map((r) => G.circleOf(AXIS, MOTOR[1] + 8, r, P, 28)).join(""), { tone: "faint" }),
  shape: A.disc(AXIS, MOTOR[1], MOTOR[1] + 8, 10, { name: "drive.cowl" }),
});
// terminal box on the motor's left flank
{
  const F = upFrame(135);
  const lid = MOTOR[0] + 17;
  const screws = [-2.2, 2.2].map((t) => at(G.add3(G.add3(G.mul3(dir(135), 12), G.mul3(dir(225), t)), [0, 0, lid])));
  prismAt("drive", F, [[10, -3.6], [13.6, -3.6], [13.6, 3.6], [10, 3.6]], MOTOR[0] + 8, lid, {}, {
    name: "drive.terminal-box",
    extra: Dots(screws, { size: 0.38 }),
  });
}

// ================================================================= controller on the bench
// The box that closes the loops: a trend screen on its near face, set knobs and status lamps on top.
{
  const BOX = { x: -64, y: 20, w: 22, d: 42, r: 2 };
  const top = 17;
  const fx = BOX.x + BOX.w; // the face toward +x carries the screen
  const knobs = [30, 38, 46].map((y) => [BOX.x + 7, y]);
  const vent = k.dotGrid(BOX.x + 4, BOX.y + 30 - 0, 2, 5, 2.2, top, P);
  const screen = { y0: BOX.y + 5, y1: BOX.y + BOX.d - 5, z0: 4.5, z1: 13.5 };
  const quad = (x, a, b) => [[x, a[0], a[1]], [x, b[0], a[1]], [x, b[0], b[1]], [x, a[0], b[1]]];
  const face = (pts) => k.pathOf(pts.map((p) => at(p)), true);
  const glass = quad(fx + 0.05, [screen.y0, screen.z0], [screen.y1, screen.z1]);
  // a temperature trend that settles onto its setpoint, drawn on the screen plane
  const trend = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    const y = screen.y0 + t * (screen.y1 - screen.y0);
    const z = 9 + 2.6 * Math.exp(-4.2 * t) * Math.cos(t * 13);
    return at([fx + 0.06, y, z]);
  });
  const setpoint = k.segment([fx + 0.06, screen.y0, 9], [fx + 0.06, screen.y1, 9], P);
  const bezel = face(quad(fx + 0.05, [screen.y0 - 1.2, screen.z0 - 1.2], [screen.y1 + 1.2, screen.z1 + 1.2]));
  const lamps = [[BOX.x + 15, BOX.y + 8], [BOX.x + 15, BOX.y + 12], [BOX.x + 15, BOX.y + 16]].map(([x, y]) => at([x, y, top]));
  const extra =
    Ln(bezel, { tone: "lo" }) +
    `<path class="fm-screen" d="${face(glass)}"/>` +
    Ln(setpoint, { tone: "faint" }) +
    Ln(k.pathOf(trend), { tone: "lit", className: "fm-trend" }) +
    Ln(k.planOutline(k.insetPlan(BOX, 1.6), top, P, 3), { tone: "faint" }) +
    Dots(vent, { size: 0.4, tone: "lo" }) +
    Dots(lamps, { size: 0.7, tone: "hi" }) +
    Dots(k.corners(BOX, 2.4).map(([x, y]) => at([x, y, top])), { size: 0.45 });
  boxAt("controller", BOX, 0, top, {}, { name: "controller.case", bevel: 0.6, steps: 4, inner: Ln(k.sideSeam(BOX, 2, P, 4), { tone: "faint" }), extra });
  for (const [x, y] of knobs) {
    const id = nameFor("controller.knob");
    put("controller", [x, y, top + 1.5], S(k.cylinder(x, y, 2.2, top, 3, P, 24, 0.3), { tone: "mid" }) + Ln(k.knurl(x, y, 2.2, top + 0.4, top + 2.6, 16, P), { tone: "lo" }) + Ln(k.lineOnTop([x, y], [x + 1.6, y - 0.6], top + 3, P), { tone: "hi", free: true }), {
      name: id,
      shapes: [record(A.cylinder(x, y, 2.2, top, 3, { name: id, owner: "controller.case" }))],
    });
  }
}

// ================================================================= settle, audit, emit
A.settle(R, P);
items.sort((a, b) => a.key - b.key);
const groups = items.map((item, index) => {
  const [mx, my, mz] = item.move;
  return `<g class="it" data-piece="${item.piece}"${item.ride !== item.piece ? ` data-ride="${item.ride}"` : ""} data-k="${item.key.toFixed(2)}" data-m="${mx.toFixed(1)},${my.toFixed(1)},${mz.toFixed(1)}" data-i="${index}">${item.svg}</g>`;
});

const LABEL_TEXT =
  "A jacketed stirred-tank bioreactor on four legs: a dished vessel with a water jacket, a harvest valve and a sample valve; three probes in side ports (pH, dissolved oxygen and temperature); a head plate carrying an exhaust condenser and filter, an air filter, a pressure gauge, feed ports and a sight glass; an agitator with two Rushton turbines hanging from the head; and a motor, gearbox and lantern on top.";
const backSvg = k.figureSvg({ width: W, height: H, label: LABEL_TEXT, body: back, className: "fm-back" });
const frontSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg fm-front" viewBox="0 0 ${W} ${H}" aria-hidden="true"><g class="fm-parts">${groups.join("")}</g></svg>`;

const unit = (vector) => {
  const o = at([0, 0, 0]);
  const p = at(vector);
  return [p[0] - o[0], p[1] - o[1]];
};
const ORDER = ["drive", "head", "agitator", "ph", "dox", "temp", "vessel", "controller"];
const DATA = { W, H, V, EX: unit([1, 0, 0]), EY: unit([0, 1, 0]), EZ: unit([0, 0, 1]), stagger: STAGGER, spring: SPRING, order: ORDER, pieces: Object.fromEntries(Object.entries(PIECES).map(([id, p]) => [id, { name: p.name }])) };

const stage = `<div class="fm-stage" tabindex="0" role="slider" aria-label="A stirred-tank bioreactor. Hover, tap or press Space to take it apart; arrow keys step through the parts; Escape puts it back together." aria-valuemin="0" aria-valuemax="${ORDER.length}" aria-valuenow="0" aria-valuetext="Assembled">${backSvg}${frontSvg}</div>`;
const corners = `<div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="fig">Fig 1</span><span class="iso-plate-corner" data-corner="title">Bioreactor · 25 L</span><span class="iso-plate-corner" data-corner="readout" data-readout>${readoutAt(null, false, false)}</span></div>`;
const controls = `<div class="fm-controls"><span class="fm-hint" data-hint>Hover to take it apart</span><span class="fm-live" aria-live="polite" data-live></span></div>`;
const PARTS = ORDER.map((id, i) => `<button type="button" class="fm-part" data-part="${id}"><span class="fm-num">${String(i + 1).padStart(2, "0")}</span>${PIECES[id].name}</button>`).join("");
const caption =
  "A 25 L pilot fermenter. Air is filtered, bubbled in below the lower turbine and broken into fine bubbles by the blades at 300 rpm; the probes report pH, dissolved oxygen and temperature, and the controller answers with acid, base, air and jacket water. Same loop as a web service: sense, decide, act, log.";
const FIGURE = `<figure class="iso-figure fm"><div class="iso-plate">${corners}${stage}${controls}</div><figcaption class="iso-legend"><span class="fm-parts-list">${PARTS}</span><span class="iso-caption">${caption}</span></figcaption></figure>`;

mkdirSync(join(ROOT, "components", "fermenter"), { recursive: true });
const HEADER = "// Generated by scripts/fermenter/build.mjs. Do not edit by hand: change the build and run it again.\n/* eslint-disable */\n";
// The markup is a static file the page fetches once: it keeps ~0.5 MB of SVG out of the HTML and the
// RSC payload (a server component would send it twice). The hash in the URL busts the cache on rebuild.
mkdirSync(join(ROOT, "public", "fermenter"), { recursive: true });
writeFileSync(join(ROOT, "public", "fermenter", "figure.html"), FIGURE);
const VERSION = createHash("sha1").update(FIGURE).digest("hex").slice(0, 10);
writeFileSync(join(ROOT, "components", "fermenter", "fermenter-data.ts"), `${HEADER}export const FERMENTER_SRC = "/fermenter/figure.html?v=${VERSION}";\nexport const FERMENTER_DATA = ${JSON.stringify(DATA)};\n`);

// standalone preview pages for screenshots and the line check
const CSS = readFileSync(join(ROOT, "components", "fermenter", "fermenter.css"), "utf8");
const MODEL_SRC = readFileSync(join(ROOT, "components", "fermenter", "model.mjs"), "utf8").replace(/^export /gm, "");
const LIVE = readFileSync(join(ROOT, "components", "fermenter", "live.mjs"), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");
for (const theme of ["dark", "light"]) {
  const page = k.pageHtml({ title: "Fermenter", theme, body: `<style>${CSS}</style>${FIGURE}`, script: `${MODEL_SRC}\n${LIVE}\nmountFermenter(document.querySelector(".fm"), ${JSON.stringify(DATA)});`, width: 760 });
  writeFileSync(join(HERE, theme === "light" ? "preview-light.html" : "preview.html"), page);
}
console.log("wrote", `${(FIGURE.length / 1024).toFixed(0)} KB figure`, `${items.length} items`);

// the near wall is recorded in thin sectors that the crowding check reads as rods; the sample line's
// flange sits on its pad, 30 units in front of that edge (checked at 4×)
A.auditOrExit(R, P, { crowd: [["vessel.sample", "vessel.jacket"]] });
