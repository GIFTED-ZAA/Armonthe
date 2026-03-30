/**
 * forms.js
 * Governs the Commission and Consultation modals.
 *
 * ── EMAIL CONFIGURATION ───────────────────────────────────────────────────
 * This site uses Formspree (formspree.io) to deliver form submissions
 * directly to your inbox — no backend required.
 *
 * Setup (2 minutes):
 *   1. Create a free account at https://formspree.io
 *   2. Create a new form for "Commission Enquiries" → copy its endpoint URL
 *   3. Create a second form for "Consultation Requests" → copy its endpoint URL
 *   4. Replace the two endpoint placeholders below.
 *   5. Replace OWNER_EMAIL with your actual business email address.
 * ─────────────────────────────────────────────────────────────────────────
 */

const OWNER_EMAIL            = 'YOUR_EMAIL@HERE.COM';               // ← your email
const COMMISSION_ENDPOINT    = 'https://formspree.io/f/YOUR_COMMISSION_FORM_ID'; // ← Formspree endpoint
const CONSULTATION_ENDPOINT  = 'https://formspree.io/f/YOUR_CONSULTATION_FORM_ID'; // ← Formspree endpoint


/* ══ HELPERS ══════════════════════════════════════════════════════════════ */

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(m => {
    m.classList.remove('open');
  });
  document.body.style.overflow = '';
}


/* ══ COMMISSION MODAL ═════════════════════════════════════════════════════ */

function initCommissionModal() {

  // Every element that should open the Commission modal
  const triggers = document.querySelectorAll('[data-open="commission"]');
  triggers.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      openModal('modal-commission');
    });
  });

  // Close button
  const closeBtn = document.querySelector('#modal-commission .modal-close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal('modal-commission'));

  // Click outside card to close
  const overlay = document.getElementById('modal-commission');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal('modal-commission');
    });
  }

  // Form submission
  const form = document.getElementById('form-commission');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = form.querySelector('.modal-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Transmitting…';

    const payload = {
      _replyto: form.querySelector('[name="email"]').value,
      _subject: `New Commission Enquiry — ${form.querySelector('[name="name"]').value}`,
      Name:     form.querySelector('[name="name"]').value,
      Email:    form.querySelector('[name="email"]').value,
      Commission_Type: form.querySelector('[name="type"]').value,
      Vision:   form.querySelector('[name="vision"]').value || '—',
    };

    try {
      const res = await fetch(COMMISSION_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess('modal-commission');
      } else {
        fallbackMailto('commission', payload);
      }
    } catch {
      // Network issue — open user's mail client as graceful fallback
      fallbackMailto('commission', payload);
    }
  });
}


/* ══ CONSULTATION MODAL ═══════════════════════════════════════════════════ */

function initConsultationModal() {

  // Pricing CTA triggers — each carries data-plan attribute
  const triggers = document.querySelectorAll('[data-open="consultation"]');
  triggers.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const plan = el.getAttribute('data-plan') || '';
      // Populate the plan badge
      const badge = document.getElementById('consultation-plan');
      if (badge && plan) {
        badge.textContent = plan;
        badge.closest('.modal-plan-badge').style.display = 'inline-flex';
      } else if (badge) {
        badge.closest('.modal-plan-badge').style.display = 'none';
      }
      openModal('modal-consultation');
    });
  });

  // Close button
  const closeBtn = document.querySelector('#modal-consultation .modal-close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal('modal-consultation'));

  // Click outside card
  const overlay = document.getElementById('modal-consultation');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal('modal-consultation');
    });
  }

  // Form submission
  const form = document.getElementById('form-consultation');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn  = form.querySelector('.modal-submit');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Transmitting…';

    const payload = {
      _replyto:  form.querySelector('[name="email"]').value,
      _subject:  `Consultation Request — ${form.querySelector('[name="name"]').value}`,
      Name:      form.querySelector('[name="name"]').value,
      Email:     form.querySelector('[name="email"]').value,
      Plan:      document.getElementById('consultation-plan')?.textContent || '—',
      Availability: form.querySelector('[name="availability"]').value,
      Language:  form.querySelector('[name="language"]').value,
      Notes:     form.querySelector('[name="notes"]').value || '—',
    };

    try {
      const res = await fetch(CONSULTATION_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess('modal-consultation');
      } else {
        fallbackMailto('consultation', payload);
      }
    } catch {
      fallbackMailto('consultation', payload);
    }
  });
}


/* ══ SUCCESS STATE ════════════════════════════════════════════════════════ */

function showSuccess(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.querySelector('.modal-form')?.classList.add('hidden');
  modal.querySelector('.modal-success')?.classList.add('visible');
}


/* ══ MAILTO FALLBACK ══════════════════════════════════════════════════════
   If Formspree isn't configured yet, gracefully open the user's
   default mail client with all form data pre-filled.
   ═════════════════════════════════════════════════════════════════════════ */

function fallbackMailto(type, data) {
  const subject  = encodeURIComponent(data._subject || 'Armonthe Enquiry');
  const bodyLines = Object.entries(data)
    .filter(([k]) => !k.startsWith('_'))
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`);
  const body = encodeURIComponent(bodyLines.join('\n\n'));
  window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;

  // Still show success UI
  showSuccess(type === 'commission' ? 'modal-commission' : 'modal-consultation');
}


/* ══ GLOBAL ESC KEY ═══════════════════════════════════════════════════════ */

function initEscapeKey() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals();
  });
}


/* ══ EXPORT ═══════════════════════════════════════════════════════════════ */

export function initForms() {
  initCommissionModal();
  initConsultationModal();
  initEscapeKey();
}
