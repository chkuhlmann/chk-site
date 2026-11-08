// src/assets/js/reveal.js (load after crt-cursor.js)
(() => {
  if (!('IntersectionObserver' in window) ||
      !matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const items = document.querySelectorAll(
    '.about-section > *, .work-item, .services-list article, .final-cta > *');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  items.forEach((el, i) => { el.dataset.reveal = ''; el.style.setProperty('--i', i % 4); io.observe(el); });
})();

