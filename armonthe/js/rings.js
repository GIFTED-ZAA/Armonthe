/**
 * rings.js
 * Canvas animation: concentric rotating rings in the hero background.
 *
 * Each ring has:
 * - r    : radius (fibonacci numbers: 89, 144, 233, 377, 560)
 * - spd  : rotation speed (positive = clockwise, negative = counter-clockwise)
 * - ang  : current angle (updated each frame)
 * - col  : stroke color (rgba string)
 * - sw   : stroke width
 * - dash : line dash pattern [] = solid, [4,12] = dashed
 *
 * Each ring also has a small dot that orbits around it at a different speed,
 * creating a subtle "planet" effect.
 *
 * The canvas is positioned at 62% across / 42% down the hero.
 * It's sized to match the element and scaled for device pixel ratio (retina).
 */

export function initRings() {
  const canvas = document.getElementById('rings-cv');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;

  // Scale canvas for high-DPI screens (retina = devicePixelRatio 2)
  const resize = () => {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };

  // Ring definitions — radii follow the fibonacci sequence
  const rings = [
    { r: 89,  spd:  0.22, ang: 0,   col: 'rgba(142,206,197,.15)', sw: 0.9, dash: [] },
    { r: 144, spd: -0.14, ang: 1.2, col: 'rgba(91,164,212,.11)',  sw: 1.2, dash: [] },
    { r: 233, spd:  0.10, ang: 2.4, col: 'rgba(179,165,227,.09)', sw: 0.7, dash: [4, 12] },
    { r: 377, spd: -0.07, ang: 0.8, col: 'rgba(201,131,106,.08)', sw: 0.6, dash: [] },
    { r: 560, spd:  0.04, ang: 1.8, col: 'rgba(42,33,24,.04)',    sw: 0.5, dash: [3, 16] },
  ];

  let t = 0; // Global time counter

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    t += 0.01;

    // Center of the ring system (62% right, 42% down)
    const cx = W * 0.62;
    const cy = H * 0.42;

    rings.forEach((ring, i) => {
      // Rotate the ring slightly each frame
      ring.ang += ring.spd * 0.012;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ring.ang);

      // Draw the ring
      ctx.beginPath();
      ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = ring.col;
      ctx.lineWidth   = ring.sw;
      ctx.setLineDash(ring.dash);
      ctx.stroke();

      // Draw orbiting dot — moves at a different speed than the ring rotation
      // i%2 alternates clockwise/counter-clockwise per ring
      const dotAngle = t * (i % 2 === 0 ? 1.2 : -0.8) + i;
      const nx = Math.cos(dotAngle) * ring.r;
      const ny = Math.sin(dotAngle) * ring.r;

      ctx.setLineDash([]); // Reset dash for the dot
      ctx.beginPath();
      ctx.arc(nx, ny, ring.sw * 2.2, 0, Math.PI * 2);
      // Make dot slightly more opaque than the ring
      ctx.fillStyle = ring.col.replace(/[\d.]+\)$/, '0.75)');
      ctx.fill();

      ctx.restore();
    });

    requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener('resize', resize, { passive: true });
}
