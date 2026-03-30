/**
 * orbit.js
 * Makes emoji icons (.orb) fly in elliptical orbits in the hero.
 *
 * Each orb is configured with:
 * - r   : orbit radius (horizontal distance from center)
 * - spd : how fast it moves (higher = faster)
 * - ang : starting angle in radians
 *
 * The ellipse is created by scaling the Y component by 0.5,
 * turning a circle into a flat ellipse.
 *
 * x = cos(angle) * r
 * y = sin(angle) * r * 0.5   ← squash vertically for ellipse
 */

export function initOrbit() {
  const orbs = document.querySelectorAll('.orb');
  if (orbs.length === 0) return;

  const configs = [
    { r: 144, spd:  0.50, ang: 0    },
    { r:  89, spd: -0.70, ang: 1.26 },
    { r: 165, spd:  0.40, ang: 2.51 },
    { r: 110, spd: -0.60, ang: 3.77 },
    { r:  89, spd:  0.55, ang: 5.03 },
  ];

  let t = 0;

  const frame = () => {
    t += 0.008;
    orbs.forEach((orb, i) => {
      const cfg   = configs[i];
      const angle = cfg.ang + t * cfg.spd;
      const x     = Math.cos(angle) * cfg.r;
      const y     = Math.sin(angle) * cfg.r * 0.5; // Squash to ellipse
      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(frame);
  };

  frame();
}


/**
 * glare.js
 * A light glare that follows your mouse across pricing cards.
 *
 * How it works:
 * - Each card has a .glare div with a radial gradient
 * - The gradient center position is controlled by CSS custom properties
 *   --gx (% from left) and --gy (% from top)
 * - We update those properties on mousemove based on cursor position
 *   relative to the card's bounding box
 * - The glare div is invisible (opacity:0) by default and fades
 *   in via CSS when the card is hovered
 */

export function initGlare() {
  document.querySelectorAll('[data-glare]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100 + '%';
      const y = ((e.clientY - rect.top)  / rect.height) * 100 + '%';
      card.style.setProperty('--gx', x);
      card.style.setProperty('--gy', y);
    });
  });
}


/**
 * textPressure.js
 * The hero heading subtly skews and stretches based on mouse X position.
 * Feels like the text is being "pushed" by the cursor.
 *
 * How it works:
 * - We convert mouse X to a -0.5 → +0.5 range (nx)
 * - Apply skewX proportional to nx (max ±3.5°)
 * - Apply scaleX slightly based on absolute nx value (max ~2.2% wider)
 * - requestAnimationFrame throttle prevents applying too many transforms
 */

export function initTextPressure() {
  const heading = document.getElementById('pressure-h');
  if (!heading) return;

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const nx = e.clientX / innerWidth - 0.5; // -0.5 to +0.5
      const skew  = nx * 3.5;
      const scale = 1 + Math.abs(nx) * 0.022;
      heading.style.transform = `skewX(${skew}deg) scaleX(${scale})`;
      ticking = false;
    });
  }, { passive: true });
}
