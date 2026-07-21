function toggleMenu() {
    if (window.getComputedStyle(document.querySelector('.menu-toggle')).display !== 'none') {
        var toggle = document.querySelector('.menu-toggle');
        var nav = document.getElementById('nav-menu');
        toggle.classList.toggle('active');
        nav.classList.toggle('show');
        toggle.setAttribute('aria-expanded', nav.classList.contains('show') ? 'true' : 'false');
    }
}
