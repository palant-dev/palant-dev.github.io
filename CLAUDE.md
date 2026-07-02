# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS personal portfolio website for Antonio Palomba (Program Manager / Software Engineer). Deployed on GitHub Pages at `palant-dev.github.io` with custom domain `palant.dev` (configured in `CNAME`).

**No build system.** No package manager, no compilation step — files are served directly. To preview locally, open any `.html` file in a browser or run a simple HTTP server:

```bash
python3 -m http.server 8080
```

## Architecture

### Two page layout modes

The `<html>` element's class determines which layout engine `js/main.js` activates:

- **`one-page-layout`** — used only by `index.html`. Renders an animated 3D flip-card intro (`.card-intro` → `.card`) with sound effects driven by `data-audio-*` attributes on `<html>`. Cover image lazy-loads the high-res version via `data-image-url` on `.cover-media`.
- **`classic-page-layout`** — all other pages (about, portfolio, resume, contact, portfolio items). Standard multi-section layout with a sticky header.

### JavaScript files

| File | Purpose |
|------|---------|
| `js/main.js` | Core: loader (NProgress), layout detection, Isotope portfolio grid, Magnific Popup lightboxes, sound effects, AJAX contact form via `send-mail.php` |
| `js/portfolio-pagination.js` | Pagination over `.portfolio-items .media-cell` (6 per page); integrates with Isotope filter buttons in `#filters` |
| `js/structured-data.js` | Injects Schema.org `Person` JSON-LD into `<head>` for SEO |

### CSS load order (every page)

```
normalize.css → bootstrap.min.css → nprogress.css → magnific-popup.css
→ fontello.css → align.css → layout.css → main.css → 768.css
```

`css/main.css` is the primary stylesheet (sections: Base → Forms → Common → Layout → Modules → Theme). `css/768.css` contains all responsive overrides. `css/demo*.css` are alternate color themes that exist from the base template but are not used in production.

### Page inventory

- `index.html` — homepage (one-page-layout, 3D card)
- `about.html`, `resume.html`, `contact.html` — static info pages
- `portfolio.html` — filterable grid of projects (uses Isotope + `portfolio-pagination.js`)
- `portfolio-item-*.html` — individual project detail pages
- `blog-latest.html` — blog landing page (entry point from index.html nav; shows latest post grid)
- `blog.html` — full post list (linked from blog-latest.html via "SEE ALL POSTS")
- `blog-single.html` — individual article template (linked from blog.html; has "Back To Blog" nav link)
- `blogTemplate/` — original unedited copies of all blog page variants (reference only)
- `portfolioTemplates/` — blank templates (`portfolio-item-01/02/03.html`) for new entries
- `_unused/` — unused template demo pages from the base theme; not linked anywhere

### Contact form

`send-mail.php` handles POST from the contact form. It uses PHP's `mail()` function — this only works when hosted on a server with sendmail configured, not on GitHub Pages. The honeypot anti-spam field is named `url` (must be empty).

### Images

`images/` is organized by section: `home/`, `portfolio/`, `blog/`, `bckg/`, `site/`, `ico/`.

## Adding a new portfolio item

1. Copy `portfolioTemplates/portfolio-item-01.html` → `portfolio-item-<name>.html` in the root.
2. Add a `.media-cell` entry in `portfolio.html` with the appropriate filter class (e.g. `web`, `ios`, `design`).
3. Add the new URL to `sitemap.xml`.
4. Add a cover image to `images/portfolio/`.

## Deployment

Push to `main` branch — GitHub Pages serves the repo root automatically. The custom domain `palant.dev` is set via the `CNAME` file and DNS.
