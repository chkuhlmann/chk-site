function toggleMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('nav-menu');

    if (toggle && nav && window.getComputedStyle(toggle).display !== 'none') {
        toggle.classList.toggle('active');
        nav.classList.toggle('show');
        toggle.setAttribute('aria-expanded', nav.classList.contains('show') ? 'true' : 'false');
    }
}

function closeMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('nav-menu');

    if (!toggle || !nav) return;

    toggle.classList.remove('active');
    nav.classList.remove('show');
    toggle.setAttribute('aria-expanded', 'false');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#nav-menu a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });
    updateHomepageNavigation();
});

window.addEventListener('pageshow', closeMenu);

function updateHomepageNavigation() {
    if (window.location.pathname !== '/') return;
    var aboutIsActive = window.location.hash === '#about';
    document.querySelectorAll('#nav-menu a').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href === '#about') {
            link.removeAttribute('aria-current');
            if (href === '#about' && aboutIsActive) link.setAttribute('aria-current', 'location');
        }
    });
}

window.addEventListener('hashchange', updateHomepageNavigation);
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.getElementById('nav-menu')?.classList.contains('show')) {
        closeMenu();
        document.querySelector('.menu-toggle')?.focus();
    }
});
