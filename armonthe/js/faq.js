/**
 * faq.js
 * Optimized FAQ accordion functionality with minimal repaints
 */

export function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  let activeItem = null;
  
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-q');
    
    if (!question) return;
    
    question.addEventListener('click', (e) => {
      e.preventDefault();
      
      const isOpen = item.classList.contains('open');
      
      // Close currently open item if different
      if (activeItem && activeItem !== item) {
        activeItem.classList.remove('open');
      }
      
      // Toggle current item
      item.classList.toggle('open');
      activeItem = isOpen ? null : item;
    });
  });
}
