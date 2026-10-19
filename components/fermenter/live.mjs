import { readoutAt, SAYS } from "./model.mjs";

// Brings the fermenter figure to life: springs take the assemblies apart, parts sort by depth
// every frame, hover/tap/keys select an assembly, and an idle tour shows it when nobody is touching it.
// Returns a function that stops everything (for React's effect cleanup).
export function mountFermenter(root, D) {
  const stage = root.querySelector(".fm-stage");
  const parts = stage.querySelector(".fm-parts");
  const readout = root.querySelector("[data-readout]");
  const live = root.querySelector("[data-live]");
  const hint = root.querySelector("[data-hint]");
  const buttons = [...root.querySelectorAll(".fm-part")];
  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const narrow = matchMedia("(hover: none), (max-width: 480px)");

  const nodes = [...parts.querySelectorAll(".it")].map((el) => {
    const m = el.dataset.m.split(",").map(Number);
    return { el, piece: el.dataset.piece, ride: el.dataset.ride || el.dataset.piece, key: Number(el.dataset.k), m, lift: m[0] * D.V[0] + m[1] * D.V[1] + m[2] * D.V[2], shown: "" };
  });
  let order = nodes.map((_, i) => i);
  const IDS = Object.keys(D.pieces);
  const SPRING = D.spring;
  const piece = Object.fromEntries(IDS.map((id) => [id, { x: 0, v: 0, target: 0, pending: null }]));

  let clock = 0;
  let apart = false;
  let selected = null;
  let inside = false;
  let leaveTimer = 0;
  let idleTimer = 0;
  let touring = !still.matches;
  let tourClock = -1.4;
  let visible = false;
  let frame = 0;
  let last = 0;
  let lastPhase = "";

  const say = (text) => {
    if (readout && readout.textContent !== text) readout.textContent = text;
  };
  const announce = (text) => {
    if (live && text !== lastPhase) {
      lastPhase = text;
      live.textContent = text;
    }
  };
  function describe() {
    const text = selected ? `${D.pieces[selected].name}: ${SAYS[selected]}` : apart ? "Apart" : "Assembled";
    if (stage.getAttribute("aria-valuetext") !== text) stage.setAttribute("aria-valuetext", text);
  }

  function setApart(on) {
    if (apart === on) return;
    apart = on;
    const goal = on ? 1 : 0;
    let index = 0;
    for (const id of on ? D.stagger : [...D.stagger].reverse()) {
      const state = piece[id];
      if (!state) continue;
      if (state.target === goal) state.pending = null;
      else state.pending = { value: goal, at: clock + (still.matches ? 0 : index++ * SPRING.stagger) };
    }
    announce(on ? "taking apart" : "closing up");
    describe();
    run();
  }

  function select(id) {
    if (id === "stand") id = null;
    if (selected === id) return;
    selected = id;
    for (const node of nodes) {
      if (id !== null && node.piece === id) node.el.setAttribute("data-on", "");
      else node.el.removeAttribute("data-on");
    }
    if (id) stage.setAttribute("data-focus", "");
    else stage.removeAttribute("data-focus");
    for (const button of buttons) {
      if (button.dataset.part === id) button.setAttribute("data-on", "");
      else button.removeAttribute("data-on");
    }
    stage.setAttribute("aria-valuenow", String(id ? D.order.indexOf(id) + 1 : 0));
    describe();
  }

  function steer(state, dt, calm) {
    if (state.pending && clock >= state.pending.at) {
      state.target = state.pending.value;
      state.pending = null;
    }
    if (calm) {
      state.x = state.target;
      state.v = 0;
      return state.pending !== null;
    }
    for (let i = 0; i < SPRING.substeps; i++) {
      const h = dt / SPRING.substeps;
      state.v += ((state.target - state.x) * SPRING.stiffness - state.v * SPRING.damping) * h;
      state.x += state.v * h;
    }
    if (Math.abs(state.target - state.x) < 2e-4 && Math.abs(state.v) < 2e-4) {
      state.x = state.target;
      state.v = 0;
      return state.pending !== null;
    }
    return true;
  }

  function place() {
    for (const node of nodes) {
      const share = piece[node.ride].x;
      const tx = (D.EX[0] * node.m[0] + D.EY[0] * node.m[1] + D.EZ[0] * node.m[2]) * share;
      const ty = (D.EX[1] * node.m[0] + D.EY[1] * node.m[1] + D.EZ[1] * node.m[2]) * share;
      const text = share === 0 ? "" : `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`;
      if (text !== node.shown) {
        node.shown = text;
        if (text) node.el.setAttribute("transform", text);
        else node.el.removeAttribute("transform");
      }
    }
    const keyOf = (i) => nodes[i].key + nodes[i].lift * piece[nodes[i].ride].x;
    const next = nodes.map((_, i) => i).sort((a, b) => keyOf(a) - keyOf(b));
    if (next.some((index, i) => index !== order[i])) {
      const fragment = document.createDocumentFragment();
      for (const index of next) fragment.appendChild(nodes[index].el);
      parts.appendChild(fragment);
      order = next;
    }
  }

  const STEP = 1.7;
  function tourAt(time) {
    const listFrom = 1.1;
    const listTo = listFrom + D.order.length * STEP;
    const total = listTo + 3.4;
    const t = ((time % total) + total) % total;
    if (time < 0) return { apart: false, part: null };
    if (t < listFrom) return { apart: true, part: null };
    if (t < listTo) return { apart: true, part: D.order[Math.floor((t - listFrom) / STEP)] };
    return { apart: false, part: null };
  }

  function quietTour() {
    touring = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (inside || root.contains(document.activeElement)) return quietTour();
      touring = !still.matches;
      tourClock = -0.6;
      run();
    }, 3600);
  }

  function moving() {
    return IDS.some((id) => Math.abs(piece[id].x - piece[id].target) > 0.002 || piece[id].pending);
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    clock += dt;
    const calm = still.matches;
    if (touring) {
      tourClock += dt;
      const step = tourAt(tourClock);
      setApart(step.apart);
      select(step.part);
    }
    let busy = false;
    for (const id of IDS) if (steer(piece[id], dt, calm)) busy = true;
    place();
    say(readoutAt(selected, apart, moving()));
    if (!busy && !moving()) announce(apart ? "apart" : "assembled");
    frame = visible && (busy || touring) ? requestAnimationFrame(tick) : 0;
  }

  function run() {
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  const pieceAt = (event) => {
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    const item = hit && hit.closest ? hit.closest(".it") : null;
    return item && stage.contains(item) ? item.dataset.piece : null;
  };

  const onMove = (event) => {
    if (event.pointerType === "touch") return;
    inside = true;
    clearTimeout(leaveTimer);
    quietTour();
    setApart(true);
    select(pieceAt(event));
    run();
  };
  const onLeave = () => {
    inside = false;
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => {
      if (inside) return;
      select(null);
      setApart(false);
    }, 260);
  };
  const onDown = (event) => {
    if (event.pointerType !== "touch") return;
    quietTour();
    const id = pieceAt(event);
    if (!id || id === "stand" || (apart && selected === id)) {
      select(null);
      setApart(!apart);
    } else {
      setApart(true);
      select(id);
    }
    run();
  };
  const onKey = (event) => {
    const index = selected ? D.order.indexOf(selected) : -1;
    let next = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(D.order.length - 1, index + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, index - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = D.order.length - 1;
    else if (event.key === "Escape") {
      event.preventDefault();
      quietTour();
      select(null);
      setApart(false);
      return;
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      quietTour();
      if (apart) select(null);
      setApart(!apart);
      return;
    }
    if (next === null) return;
    event.preventDefault();
    quietTour();
    setApart(true);
    select(D.order[next]);
    run();
  };
  const onFocus = () => {
    if (live) live.textContent = apart ? "apart" : "assembled";
  };

  const buttonCleanups = buttons.map((button) => {
    const show = () => {
      quietTour();
      clearTimeout(leaveTimer);
      setApart(true);
      select(button.dataset.part);
      run();
    };
    const hide = () => {
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        if (inside || buttons.some((other) => other.matches(":hover, :focus-visible"))) return;
        select(null);
        setApart(false);
      }, 260);
    };
    button.addEventListener("pointerenter", show);
    button.addEventListener("focus", show);
    button.addEventListener("click", show);
    button.addEventListener("pointerleave", hide);
    button.addEventListener("blur", hide);
    return () => {
      button.removeEventListener("pointerenter", show);
      button.removeEventListener("focus", show);
      button.removeEventListener("click", show);
      button.removeEventListener("pointerleave", hide);
      button.removeEventListener("blur", hide);
    };
  });

  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
  stage.addEventListener("pointerdown", onDown);
  stage.addEventListener("keydown", onKey);
  stage.addEventListener("focus", onFocus);

  const wording = () => {
    if (hint) hint.textContent = narrow.matches ? "Tap to take it apart" : "Hover to take it apart";
  };
  wording();
  narrow.addEventListener("change", wording);
  const onStill = () => {
    touring = !still.matches && !inside;
    run();
  };
  still.addEventListener("change", onStill);

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    },
    { rootMargin: "120px 0px" },
  );
  observer.observe(stage);
  place();
  say(readoutAt(null, false, false));

  return () => {
    cancelAnimationFrame(frame);
    frame = 0;
    clearTimeout(leaveTimer);
    clearTimeout(idleTimer);
    observer.disconnect();
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    stage.removeEventListener("pointerdown", onDown);
    stage.removeEventListener("keydown", onKey);
    stage.removeEventListener("focus", onFocus);
    narrow.removeEventListener("change", wording);
    still.removeEventListener("change", onStill);
    buttonCleanups.forEach((fn) => fn());
  };
}
