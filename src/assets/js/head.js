        document.documentElement.classList.add('js');
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Keep the site's previous hash URLs useful while the primary routes use real URLs.
        document.addEventListener('DOMContentLoaded', function() {
            var legacyRoutes = { '#bio': '#about', '#credits': '#selected-work' };
            var replacement = legacyRoutes[window.location.hash];

            if (replacement) {
                history.replaceState(null, '', replacement);
                document.querySelector(replacement)?.scrollIntoView();
            } else if (window.location.hash === '#blog') {
                window.location.replace('/blog/');
            }
        });
