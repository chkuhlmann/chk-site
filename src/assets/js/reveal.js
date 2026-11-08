// Content is visible by default. Only offscreen homepage items are prepared to reveal.
(() => {
    const homepage = document.querySelector('.homepage');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const forcedColors = matchMedia('(forced-colors: active)');
    if (!homepage || reducedMotion.matches || forcedColors.matches ||
        !('IntersectionObserver' in window)) return;

    const items = homepage.querySelectorAll(
        '.about-section > *, .work-item, .services-list article, .final-cta > *'
    );
    let observer;
    function show(item) {
        item.dataset.reveal = 'visible';
        observer?.unobserve(item);
    }
    function showAll() {
        observer?.disconnect();
        items.forEach(item => item.removeAttribute('data-reveal'));
    }

    try {
        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) show(entry.target);
            });
        }, { threshold: 0 });
        items.forEach(item => {
            // Skip already-visible items, including content reached through an anchor.
            if (item.getBoundingClientRect().top < innerHeight) {
                item.dataset.reveal = 'visible';
            } else {
                observer.observe(item);
                item.dataset.reveal = 'pending';
            }
        });
    } catch {
        showAll();
        return;
    }
    // Keyboard focus must never land in faded content, even before an observer callback.
    homepage.addEventListener('focusin', event => {
        const item = event.target.closest('[data-reveal]');
        if (item) show(item);
    });
    reducedMotion.addEventListener('change', showAll);
    forcedColors.addEventListener('change', showAll);
    window.addEventListener('pageshow', event => {
        if (event.persisted) showAll();
    });
})();
