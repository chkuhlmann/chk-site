// Progressive enhancement: the OS cursor remains until a mouse is actually used.
(() => {
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const forcedColors = matchMedia('(forced-colors: active)');
    const root = document.documentElement;
    const cursor = document.createElement('div');
    cursor.className = 'crt-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.append(cursor);

    const clickable = 'a[href], area[href], button, summary, select, label[for], [role="button"], [role="link"], input[type="submit"], input[type="button"], input[type="reset"], input[type="checkbox"], input[type="radio"]';
    const nativeCursor = 'textarea, input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), [contenteditable]:not([contenteditable="false"]), iframe, video, audio, [disabled], [aria-disabled="true"], [inert]';
    let position = null;

    function enabled() {
        return finePointer.matches && !reducedMotion.matches && !forcedColors.matches;
    }

    function hide() {
        root.classList.remove('crt-cursor-active');
        cursor.classList.remove('is-pointer', 'is-pressed');
        position = null;
    }

    function updateTarget(target) {
        if (!(target instanceof Element) || target.closest(nativeCursor)) {
            hide();
            return false;
        }
        cursor.classList.toggle('is-pointer', Boolean(target.closest(clickable)));
        root.classList.add('crt-cursor-active');
        return true;
    }

    function move(event) {
        if (event.pointerType !== 'mouse' || !enabled()) {
            hide();
            return;
        }
        if (!updateTarget(event.target)) return;
        const x = event.clientX;
        const y = event.clientY;
        // No easing on the hotspot: visual feedback stays aligned with clicks.
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        position = { x, y };
    }

    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', event => {
        if (position && enabled()) updateTarget(event.target);
    }, { passive: true });
    document.addEventListener('pointerout', event => {
        if (!event.relatedTarget) hide();
    });
    document.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'mouse') hide();
        else cursor.classList.add('is-pressed');
    }, { passive: true });
    document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
    document.addEventListener('pointercancel', hide);
    document.addEventListener('keydown', event => {
        if (event.key === 'Tab') hide();
    });
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('pagehide', hide);
    window.addEventListener('resize', hide);
    // Scrolling can place a different control under a stationary mouse.
    window.addEventListener('scroll', () => {
        if (position) updateTarget(document.elementFromPoint(position.x, position.y));
    }, { passive: true, capture: true });
    for (const query of [finePointer, reducedMotion, forcedColors]) {
        query.addEventListener('change', hide);
    }
})();
