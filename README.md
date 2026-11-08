# Caleb Kuhlmann Studio

This repository contains the Eleventy website for Caleb Kuhlmann's audio
engineering, music production, and private-instruction work. The production
site is published at
[calebkuhlmann.studio](https://calebkuhlmann.studio).

The website is the public surface of the broader **Caleb Kuhlmann Studio**
product program, which also includes the private Lesson Manager application and
future business workflow tools. They share a brand and product direction while
remaining separate applications with separate privacy and deployment
boundaries.

Read [docs/PRODUCT_VISION.md](docs/PRODUCT_VISION.md) for the consolidated
cross-project mission and context,
[docs/PLATFORM_ROADMAP.md](docs/PLATFORM_ROADMAP.md) for the current stack and
prioritized roadmap, and [AGENTS.md](AGENTS.md) before broad product,
architecture, lessons, or design changes.

## Technology stack

- [Eleventy](https://www.11ty.dev/) static site generator
- Nunjucks templates and Markdown blog posts
- Decap CMS for blog content management
- GitHub Pages and GitHub Actions for production hosting and deployment

## Installation

Install the Node.js dependencies from the lockfile:

```sh
npm ci
```

The deployment workflow uses Node.js 22, so that version is recommended for local development.

## Local development

Start Eleventy's local development server:

```sh
npm start
```

## Production build

Generate the production site in `_site/`:

```sh
npm run build
```

The generated `_site/` directory is build output and is not committed.

## Content and CMS

Blog posts are Markdown files in `src/blog/`. Each post builds to its own HTML page, `src/blog/index.njk` generates the blog index, and `src/blog/feed.11ty.js` generates the homepage JSON feed.

Decap CMS is available from `/admin/`. Its configuration is in `src/admin/config.yml`, and its entry page is `src/admin/index.html`.

Site-wide data lives in `src/_data/`, layouts and reusable templates live in `src/_includes/`, and browser assets live in `src/assets/`.

### Search metadata

Page titles and descriptions live in page front matter. The shared metadata
template and `src/_data/eleventyComputed.js` generate canonical URLs, social
previews, and JSON-LD from that data. Site defaults live in `src/_data/site.json`.
The homepage and Service structured data share `src/_data/services.json`.
Custom post images can use `image` and `imageAlt` in front matter.

Unlisted pages keep their noindex directive and omit structured data.
The admin page is also marked noindex.

### Website images

Keep full-resolution photo masters in `image-sources/`, outside the published
site. Use web-sized exports in `src/assets/images/` and the CMS upload folder.
The homepage portrait has responsive AVIF, WebP, and JPEG exports. Its 1400 px
JPEG also supplies the social preview. Preserve existing filenames when
replacing images that already have public links.

## Deployment

GitHub Actions runs `.github/workflows/pages.yml` for pushes to `main` and for manual workflow dispatches. The workflow installs dependencies with `npm ci`, builds the Eleventy site, adds `.nojekyll`, and deploys `_site/` through GitHub Pages.

The custom domain is emitted as `/CNAME` during the Eleventy build.

Dependabot checks npm and GitHub Actions dependencies weekly and opens update pull requests against `site-overhaul`.

### Credits and unlisted pages

Edit the published copy of the credits Sheet configured in `config/credits-source.json`.
Keep the `Artist`, `Track`, `Service`, and `Release` headers. Use ` | ` between
collaborating artists (leave ampersands inside band names), and repeat the
preferred album title in `Release` for songs that should share one cover.
No Spotify links or image/date columns are required.

Every push to `main` or manual Pages workflow run fetches the latest Sheet,
resolves its releases through Spotify, groups credits by release, and builds
the finished gallery. No separate sync command is needed before pushing.
Google's published CSV can take a short time to reflect an edit; save the
Sheet and allow it to update before pushing.

One-time setup: publish the credits tab as CSV (the configured URL is already
verified), then add the repository Actions secrets `SPOTIFY_CLIENT_ID` and
`SPOTIFY_CLIENT_SECRET`. Secrets are used only during the build. The public
page has no credentials, API calls, review controls, or loading states.

Matching prefers full albums over singles with the same release title, then
the earliest matching edition. All specified collaborators must match.
Unmatched/unavailable releases remain in the Sheet, are omitted from the
gallery, and are retried automatically on the next publishing run. Network,
authentication, rate-limit, invalid-Sheet, and all-unmatched failures stop the
deployment, preserving the last published site.

`npm run build` and pull-request builds use `src/_data/releases.json` without
network access. To refresh a local build, run `npm run build:live`; local
credentials are read from the Git-ignored `.env.spotify.local`. The source
Sheet snapshot is stored separately in `data/credits-sheet.json` for inspection.
`npm run preview:credits` previews the same finished gallery at
`http://127.0.0.1:8091/credits-preview/`; that route is excluded from production.

The blog and lessons remain available by direct URL. The `unlisted` flag in
the blog directory data and lessons page excludes them from the sitemap and
adds a noindex directive. The JSON feed omits unlisted posts. When a section
launches, remove its flag and add navigation links as a separate editorial choice.
