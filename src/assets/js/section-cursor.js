// Reserve the cursor's space at each ending so blinking never reflows the text.
(() => {
    const cursors = Array.from(document.querySelectorAll('[data-cursor-tail]'), tail => {
        const cursor = document.createElement('span');
        cursor.className = 'section-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        tail.append(cursor);
        return cursor;
    });

    let active;
    let pending = false;
    function update() {
        pending = false;
        const height = document.documentElement.clientHeight;
        let nearest;
        let distance = Infinity;
        for (const cursor of cursors) {
            const rect = cursor.getBoundingClientRect();
            if (!rect.height || rect.top < 0 || rect.bottom > height) continue;
            const fromCenter = Math.abs((rect.top + rect.bottom - height) / 2);
            if (fromCenter < distance) {
                nearest = cursor;
                distance = fromCenter;
            }
        }
        if (nearest === active) return;
        active?.classList.remove('is-active');
        nearest?.classList.add('is-active');
        active = nearest;
    }

    function schedule() {
        if (pending) return;
        pending = true;
        requestAnimationFrame(update);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    new ResizeObserver(schedule).observe(document.querySelector('main'));
    schedule();
})();
