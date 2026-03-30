/**
 * main.js
 * Entry point — imports and initializes all modules.
 */

import { initCursor }       from './cursor.js';
import { initTimer }        from './timer.js';
import { initNav, initReveal, initCountUp } from './nav.js';
import { initCardSwap }     from './cardSwap.js';
import { initRings }        from './rings.js';
import { initOrbit, initGlare, initTextPressure } from './orbit.js';
import { initAboutFX, initPhilFX, initWhyFX, initProcFX } from './sectionFX.js';
import { initFAQ }          from './faq.js';

// Run everything
initCursor();
initTimer();
initNav();
initReveal();
initCountUp();
initCardSwap();
initRings();
initOrbit();
initGlare();
initTextPressure();
initAboutFX();
initPhilFX();
initWhyFX();
initProcFX();
initFAQ();

