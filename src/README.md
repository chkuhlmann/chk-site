# Caleb Kuhlmann Studio

This repository contains the Eleventy website for Caleb Kuhlmann's audio engineering and music production work. The production site is published at [calebkuhlmann.studio](https://calebkuhlmann.studio).

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

Blog posts are Markdown files in `blog/`. The blog feed template is `blog/blog.json.njk`.

Decap CMS is available from `/admin/`. Its configuration is in `admin/config.yml`, and its entry page is `admin/index.html`.

## Deployment

GitHub Actions runs `.github/workflows/pages.yml` for pushes to `main` and for manual workflow dispatches. The workflow installs dependencies with `npm ci`, builds the Eleventy site, adds `.nojekyll`, and deploys `_site/` through GitHub Pages.

The custom domain is emitted as `/CNAME` during the Eleventy build.

