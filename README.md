# Tech at The Ridge

Course site for Computer Science, Cybersecurity, and Money Matters at Vista Ridge High School (Leander ISD). Rebuilt from the original [Wix site](https://tonymorales5.wixsite.com/comp-sci) as a static, no-build-step site suitable for GitHub Pages.

## Structure

```
index.html              single-page site (hero, syllabi, pathways, footer)
assets/css/style.css     all styling
assets/js/script.js      particle canvas, parallax, scroll reveal, card tilt, mobile nav
assets/images/           AI-generated hero + course card art
syllabi/                 course syllabus PDFs, linked from the course cards and footer
```

## Local preview

No build tooling required — any static file server works:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, enable **Pages** → Deploy from branch → `main` → `/ (root)`.
3. The site will be live at `https://<username>.github.io/<repo>/`.

## Updating content

- **Course text & syllabus links**: edit the `<article class="course-card">` blocks in `index.html`.
- **Syllabus PDFs**: replace the file in `syllabi/` and keep the filename (or update the `href` in `index.html` and the footer to match).
- **Images**: replace files in `assets/images/` (same filenames) or swap the `src`/`background-image` references in `index.html` / `style.css`.
- **Compliance / footer text**: the Leander ISD nondiscrimination statement and translated-document links in the footer are copied verbatim from the district-required language — don't edit without checking with the district first.
