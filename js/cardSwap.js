/**
 * cardSwap.js
 * Rotates through the words in the hero ("One Vision", "One Standard", etc.)
 *
 * The DOM contains multiple .sw elements stacked in a clipping container.
 * We cycle through them by toggling three CSS classes:
 *
 *   .on  — currently visible (centered)
 *   .out — exiting upward (opacity 0, translateY(-130%))
 *   .in  — waiting below (opacity 0, translateY(70%))
 *
 * Sequence for transitioning from word A to word B:
 * 1. A: remove .on → add .out  (starts sliding up and fading)
 * 2. B: remove .in → add .on   (slides up from below and fades in)
 * 3. After 480ms: A: remove .out → add .in (reset to bottom, ready to reuse)
 */

export function initCardSwap() {
  const words = document.querySelectorAll('.sw');
  if (words.length === 0) return;

  let currentIndex = 0;

  setInterval(() => {
    const prev = words[currentIndex];
    currentIndex = (currentIndex + 1) % words.length;
    const next = words[currentIndex];

    // Exit current word upward
    prev.classList.remove('on');
    prev.classList.add('out');

    // Enter next word from below
    next.classList.remove('in');
    next.classList.add('on');

    // After the exit animation finishes, move prev below ready for reuse
    setTimeout(() => {
      prev.classList.remove('out');
      prev.classList.add('in');
    }, 480); // Match the CSS transition duration

  }, 2700); // Swap every 2.7 seconds
}
