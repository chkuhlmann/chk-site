        function getRouteFromHash(hash) {
            var route = (hash || '#bio').replace(/^#/, '');
            return /^(bio|credits|blog|lessons)$/.test(route) ? route : null;
        }

        function escapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
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

            var blogContainer = document.getElementById('blog-posts-container');

            fetchWithTimeout('./blog.json')
                .then(response => {
                    if (!response.ok) throw new Error('Blog request failed');
                    return response.json();
                })
                .then(posts => {
                    if (!Array.isArray(posts) || posts.length === 0) {
                        blogContainer.innerHTML = '<p>No entries found. Check back soon.</p>';
                        blogContainer.setAttribute('aria-busy', 'false');
                        return;
                    }
                    blogContainer.innerHTML = posts.map(post => {
                        const displayTitle = String(post.title).padStart(3, '0');
                        
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
                    blogContainer.setAttribute('aria-busy', 'false');
                })
                .catch(() => {
                    console.error('Blog feed request failed.');
                    blogContainer.innerHTML = '<p role="alert">Blog entries are temporarily unavailable. Please try again later.</p>';
                    blogContainer.setAttribute('aria-busy', 'false');
                });
        });
