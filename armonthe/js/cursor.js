/**
 * cursor.js
 * Custom crosshair cursor that tracks the mouse.
 * Grows slightly when hovering over interactive elements.
 *
 * How it works:
 * - #cur element is a 22×22px div with two ::before/::after lines
 * - We just update its transform on every mousemove
 * - On interactive element hover, we add .cur-hover to <body>
 *   which CSS uses to widen/taller the crosshair bars
 */

export function initCursor() {
  const cur = document.getElementById('cur');
  if (!cur) return;

  // Move cursor to mouse position
  document.addEventListener('mousemove', (e) => {
    // translate(-50%, -50%) centers the div on the cursor hotspot
    cur.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
  }, { passive: true });

  // Grow the cursor when hovering clickable things
  document.querySelectorAll('a, button, [data-glare]').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });
}
