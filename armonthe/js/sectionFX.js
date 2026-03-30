/**
 * sectionFX.js
 * Premium canvas animations for interior sections.
 * Each mirrors the quality of the hero rings — but with distinct personalities.
 *
 *  1. aboutFX   — constellation of drifting stars with connecting lines
 *  2. philFX    — slow-breathing nebula: layered radial glows + micro-particles
 *  3. whyFX     — magnetic particle lattice that reacts to mouse proximity
 *  4. procFX    — orbiting geometric rings (sibling to hero rings, darker palette)
 */


/* ─────────────────────────────────────────────────────────────
   UTILITY — canvas resize helper (retina-aware)
───────────────────────────────────────────────────────────── */
function makeCanvas(id) {
  const cv  = document.getElementById(id);
  if (!cv) return null;
  const ctx = cv.getContext('2d');
  let W, H;
  const resize = () => {
    W = cv.offsetWidth;
    H = cv.offsetHeight;
    cv.width  = W * devicePixelRatio;
    cv.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  return { cv, ctx, get W() { return W; }, get H() { return H; } };
}


/* ─────────────────────────────────────────────────────────────
   1. ABOUT — Constellation
   Drifting star-points; any two within 160px are joined by a
   faint line. Points drift slowly and wrap at edges.
───────────────────────────────────────────────────────────── */
export function initAboutFX() {
  const c = makeCanvas('about-cv');
  if (!c) return;

  const COUNT = 55;
  const LINK_DIST = 160;

  const pts = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * c.W,
    y:  Math.random() * c.H,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r:  Math.random() * 1.4 + 0.5,
    a:  Math.random(),   // opacity seed for twinkle
    as: (Math.random() - 0.5) * 0.012, // twinkle speed
  }));

  let t = 0;

  const draw = () => {
    const { ctx, W, H } = c;
    ctx.clearRect(0, 0, W, H);
    t += 0.016;

    // Update positions
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.a  = Math.max(0.1, Math.min(1, p.a + p.as));
      if (p.a <= 0.1 || p.a >= 1) p.as *= -1;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });

    // Draw connecting lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          const alpha = (1 - d / LINK_DIST) * 0.13;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(91,140,130,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw points
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(91,140,130,${p.a * 0.6})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };
  draw();
}


/* ─────────────────────────────────────────────────────────────
   2. PHILOSOPHY — Nebula
   Several large, slow-breathing radial gradient "clouds" drift
   across the dark section. Sub-particles orbit loosely inside.
───────────────────────────────────────────────────────────── */
export function initPhilFX() {
  const c = makeCanvas('phil-cv');
  if (!c) return;

  // Giant nebula clouds
  const clouds = [
    { x: 0.18, y: 0.35, r: 340, col: '142,200,195', spd: 0.0004, ang: 0 },
    { x: 0.72, y: 0.60, r: 280, col: '160,140,210', spd: -0.0006, ang: 1.5 },
    { x: 0.50, y: 0.15, r: 200, col: '200,140,100', spd: 0.0005, ang: 3.0 },
    { x: 0.85, y: 0.20, r: 170, col: '91,164,212', spd: -0.0004, ang: 4.7 },
  ];

  // Small drifting sparks
  const sparks = Array.from({ length: 40 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0006,
    vy: (Math.random() - 0.5) * 0.0006,
    r: Math.random() * 1.2 + 0.4,
    a: Math.random() * 0.5 + 0.1,
  }));

  let t = 0;

  const draw = () => {
    const { ctx, W, H } = c;
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    // Draw nebula clouds
    clouds.forEach(cl => {
      cl.ang += cl.spd;
      // Drift gently
      const bx = cl.x + Math.cos(cl.ang) * 0.06;
      const by = cl.y + Math.sin(cl.ang * 0.7) * 0.04;
      const cx = bx * W;
      const cy = by * H;

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cl.r);
      grad.addColorStop(0,   `rgba(${cl.col},0.12)`);
      grad.addColorStop(0.4, `rgba(${cl.col},0.06)`);
      grad.addColorStop(1,   `rgba(${cl.col},0)`);
      ctx.beginPath();
      ctx.ellipse(cx, cy, cl.r, cl.r * 0.6, cl.ang * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // Draw sparks
    sparks.forEach(sp => {
      sp.x = (sp.x + sp.vx + 1) % 1;
      sp.y = (sp.y + sp.vy + 1) % 1;
      ctx.beginPath();
      ctx.arc(sp.x * W, sp.y * H, sp.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,190,255,${sp.a * (0.5 + 0.5 * Math.sin(t + sp.x * 10))})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };
  draw();
}


/* ─────────────────────────────────────────────────────────────
   3. WHY — Magnetic Particle Lattice
   A grid of dots on the dark section. Each repels slightly from
   the mouse cursor, then springs back — like a living material.
───────────────────────────────────────────────────────────── */
export function initWhyFX() {
  const c = makeCanvas('why-cv');
  if (!c) return;

  const COLS   = 18;
  const ROWS   = 10;
  const RADIUS = 38;   // mouse repel distance
  const STRENGTH = 22; // max pixel push

  let mx = -999, my = -999;

  // Build grid anchors
  let pts = [];
  const build = () => {
    const { W, H } = c;
    const gx = W / (COLS + 1);
    const gy = H / (ROWS + 1);
    pts = [];
    for (let r = 1; r <= ROWS; r++) {
      for (let col = 1; col <= COLS; col++) {
        pts.push({
          ax: col * gx, ay: r * gy,  // anchor
          x: col * gx,  y: r * gy,   // current
          vx: 0, vy: 0,
        });
      }
    }
  };
  build();
  window.addEventListener('resize', build, { passive: true });

  // Track mouse over the section
  const sec = document.getElementById('why');
  if (sec) {
    sec.addEventListener('mousemove', e => {
      const rect = sec.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }, { passive: true });
    sec.addEventListener('mouseleave', () => { mx = -999; my = -999; }, { passive: true });
  }

  const draw = () => {
    const { ctx, W, H } = c;
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mx;
      const dy = p.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS && dist > 0) {
        const force = (1 - dist / RADIUS) * STRENGTH;
        p.vx += (dx / dist) * force * 0.14;
        p.vy += (dy / dist) * force * 0.14;
      }

      // Spring back to anchor
      p.vx += (p.ax - p.x) * 0.08;
      p.vy += (p.ay - p.y) * 0.08;
      p.vx *= 0.72;
      p.vy *= 0.72;
      p.x  += p.vx;
      p.y  += p.vy;

      // Displacement amount → opacity
      const disp = Math.sqrt((p.x - p.ax) ** 2 + (p.y - p.ay) ** 2);
      const ao = 0.08 + Math.min(disp / STRENGTH, 1) * 0.35;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(142,200,195,${ao})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };
  draw();
}


/* ─────────────────────────────────────────────────────────────
   4. PROCESS — Orbital Rings (darker sibling of hero rings)
   Same mechanic as rings.js but with smaller radii, sage-teal
   palette, and positioned at the far right of the section.
───────────────────────────────────────────────────────────── */
export function initProcFX() {
  const c = makeCanvas('proc-cv');
  if (!c) return;

  const { ctx } = c;

  const rings = [
    { r:  55, spd:  0.30, ang: 0,    col: 'rgba(142,206,197,.18)', sw: 0.8, dash: [] },
    { r:  90, spd: -0.20, ang: 0.9,  col: 'rgba(91,164,212,.13)',  sw: 1.0, dash: [] },
    { r: 138, spd:  0.13, ang: 2.1,  col: 'rgba(179,165,227,.10)', sw: 0.6, dash: [3,10] },
    { r: 196, spd: -0.08, ang: 1.3,  col: 'rgba(142,206,197,.07)', sw: 0.5, dash: [] },
    { r: 268, spd:  0.05, ang: 3.8,  col: 'rgba(91,164,212,.05)',  sw: 0.4, dash: [2,14] },
  ];

  // Second smaller cluster bottom-left
  const rings2 = [
    { r:  38, spd: -0.35, ang: 1.5,  col: 'rgba(200,160,100,.14)', sw: 0.7, dash: [] },
    { r:  68, spd:  0.22, ang: 0.3,  col: 'rgba(200,160,100,.09)', sw: 0.5, dash: [2,8] },
    { r: 104, spd: -0.14, ang: 2.8,  col: 'rgba(200,160,100,.06)', sw: 0.4, dash: [] },
  ];

  let t = 0;

  const drawCluster = (rings, cx, cy) => {
    rings.forEach((ring, i) => {
      ring.ang += ring.spd * 0.011;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ring.ang);

      ctx.beginPath();
      ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = ring.col;
      ctx.lineWidth   = ring.sw;
      ctx.setLineDash(ring.dash);
      ctx.stroke();

      // Orbiting dot
      const dotAngle = t * (i % 2 === 0 ? 1.4 : -1.0) + i * 1.3;
      const nx = Math.cos(dotAngle) * ring.r;
      const ny = Math.sin(dotAngle) * ring.r;

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(nx, ny, ring.sw * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = ring.col.replace(/[\d.]+\)$/, '0.8)');
      ctx.fill();

      ctx.restore();
    });
  };

  const draw = () => {
    const { W, H } = c;
    ctx.clearRect(0, 0, W, H);
    t += 0.01;

    // Main cluster — right side
    drawCluster(rings,  W * 0.82, H * 0.50);
    // Secondary cluster — left
    drawCluster(rings2, W * 0.12, H * 0.72);

    requestAnimationFrame(draw);
  };
  draw();
}
