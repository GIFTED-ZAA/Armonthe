/**
 * timer.js
 * Shows how long the user has been on the page.
 *
 * How it works:
 * - sessionStorage persists data across page refreshes but
 *   clears when the browser tab is closed
 * - We store the unix timestamp when they first arrived
 * - On each reload, we calculate elapsed = now - startTime
 *   so the timer stays accurate even after a refresh
 */

export function initTimer() {
  const box = document.getElementById('session-timer');
  const val = document.getElementById('timer-val');
  if (!box || !val) return;

  // Zero-pad a number to 2 digits: 4 → "04"
  const pad = (n) => String(n).padStart(2, '0');

  // Get or set the start timestamp
  let startedAt = parseInt(sessionStorage.getItem('armonthe_start') || '0');
  const now = Math.floor(Date.now() / 1000);

  if (startedAt > 0) {
    // Already visited — calculate elapsed from the stored start
    // (handles page refresh correctly)
  } else {
    // First visit — record when they arrived
    startedAt = now;
    sessionStorage.setItem('armonthe_start', startedAt);
  }

  let seconds = now - startedAt;

  // Render the timer display
  const render = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    val.textContent = `${mins}:${pad(secs)}`;
  };

  render();

  // Tick every second
  setInterval(() => {
    seconds++;
    sessionStorage.setItem('armonthe_t', seconds);
    render();
  }, 1000);

  // Fade in the timer (CSS handles the transition)
  box.classList.add('visible');
}
