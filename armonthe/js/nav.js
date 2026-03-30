/**
 * nav.js
 * Adds a frosted-glass background to the nav when the user scrolls.
 * CSS handles the actual visual transition — we just toggle the class.
 */

export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}


/**
 * reveal.js
 * Fade-in-up animation for elements when they scroll into view.
 *
 * How it works:
 * - Elements with class .reveal start at opacity:0 + translateY(26px)
 * - IntersectionObserver fires when they enter the viewport
 * - We add .visible which CSS transitions to opacity:1 + translateY(0)
 * - We unobserve after triggering so it only animates once
 */

export function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.08,            // Trigger when 8% of the element is visible
      rootMargin: '0px 0px -20px 0px', // Trigger slightly before bottom of viewport
    }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}


/**
 * countUp.js
 * Animates stat numbers from 0 to their target value when scrolled into view.
 *
 * How it works:
 * - Stat elements have data-target="48" data-suf="h" data-prefix="$" etc.
 * - When the stats block scrolls into view, we run a timed animation
 * - requestAnimationFrame gives us smooth 60fps updates
 * - An ease-out curve (1 - (1-p)^4) makes it decelerate at the end
 */

export function initCountUp() {
  const statsBlock = document.getElementById('stats-block');
  if (!statsBlock) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Find all animatable number elements in this block
        entry.target.querySelectorAll('.stat__n[data-target]').forEach((el) => {
          const target   = +el.dataset.target;
          const suffix   = el.dataset.suf    || '';
          const prefix   = el.dataset.prefix || '';
          const duration = 2400; // ms

          const startTime = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease-out quartic: fast start, slow finish
            const eased = 1 - Math.pow(1 - progress, 4);
            el.textContent = prefix + Math.round(target * eased) + suffix;

            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 } // Wait until the block is half-visible
  );

  observer.observe(statsBlock);
}
