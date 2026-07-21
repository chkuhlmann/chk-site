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
});

window.addEventListener('pageshow', closeMenu);
