        function toggleMenu() {
            if (window.getComputedStyle(document.querySelector('.menu-toggle')).display !== 'none') {
                var toggle = document.querySelector('.menu-toggle');
                var nav = document.getElementById('nav-menu');
                toggle.classList.toggle('active');
                nav.classList.toggle('show');
                toggle.setAttribute('aria-expanded', nav.classList.contains('show') ? 'true' : 'false');
            }
        }

        function getRouteFromHash(hash) {
            var route = (hash || '#bio').replace(/^#/, '');
            return /^(bio|credits|blog|lessons)$/.test(route) ? route : null;
        }

        function setActiveSection(route) {
            document.querySelectorAll('section[data-route]').forEach(function(sec) {
                sec.style.display = sec.dataset.route === route ? 'block' : 'none';
            });
            document.querySelectorAll('#nav-menu a').forEach(function(link) {
                var linkRoute = getRouteFromHash(link.getAttribute('href'));
                if (linkRoute && linkRoute === route) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        function navigateToSection(e, targetHash, isInitialLoad) {
            if (e) e.preventDefault(); 
            var route = getRouteFromHash(targetHash) || 'bio';

            setActiveSection(route);
            
            window.scrollTo(0, 0);
            if (!isInitialLoad) {
                history.pushState(null, '', '#' + route);
            }
            
            if (!isInitialLoad) {
                toggleMenu();
            }
        }

        window.addEventListener('popstate', function() {
            var currentHash = window.location.hash || '#bio';
            setActiveSection(getRouteFromHash(currentHash) || 'bio');
            window.scrollTo(0, 0);
        });

        window.addEventListener('DOMContentLoaded', function() {
            var initialHash = window.location.hash || '#bio';
            
            navigateToSection(null, initialHash, true);

            fetch('./blog.json')
                .then(response => {
                    if (!response.ok) throw new Error('Network file error');
                    return response.json();
                })
                .then(posts => {
                    const container = document.getElementById('blog-posts-container');
                    if (!posts || posts.length === 0) {
                        container.innerHTML = '<p>No entries found. Check back soon.</p>';
                        return;
                    }
                    container.innerHTML = posts.map(post => {
                        const displayTitle = String(post.title).padStart(3, '0');
                        const escapeHtml = value => String(value ?? '')
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#39;');
                        
                        return `
                            <article class="blog-entry">
                                <header class="blog-entry-header">
                                    <h4 class="blog-entry-title"><a href="${escapeHtml(post.url)}">${escapeHtml(displayTitle)}</a></h4>
                                    <time datetime="${escapeHtml(post.date)}">${escapeHtml(post.displayDate)}</time>
                                </header>
                                <div class="blog-entry-content">
                                    <p>${escapeHtml(post.excerpt)}</p>
                                </div>
                            </article>
                        `;
                    }).join('');
                })
                .catch(err => {
                    console.error('Error fetching entries:', err);
                    document.getElementById('blog-posts-container').innerHTML = '<p><strong>Error:</strong> Failed to connect to the blog engine.</p>';
                });
        });
