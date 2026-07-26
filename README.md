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

## Deployment

GitHub Actions runs `.github/workflows/pages.yml` for pushes to `main` and for manual workflow dispatches. The workflow installs dependencies with `npm ci`, builds the Eleventy site, adds `.nojekyll`, and deploys `_site/` through GitHub Pages.

The custom domain is emitted as `/CNAME` during the Eleventy build.

Dependabot checks npm and GitHub Actions dependencies weekly and opens update pull requests against `site-overhaul`.
