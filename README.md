# ApnaThikana — Marketing Website

Modern, mobile-first marketing site for the student startup **ApnaThikana** ("Hostel, Mess, aur Furniture… sab ek app mein.").

Plain HTML + CSS + JS — no build step, no dependencies. Upload the folder to any static host (Netlify, Vercel, GitHub Pages) and it works.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `students.html` | For Students |
| `partners.html` | For Partners |
| `how-it-works.html` | How It Works |
| `about.html` | About |
| `contact.html` | Contact / Join Waitlist |

## Structure

```
assets/
  css/styles.css   ← all styles (design tokens at the top of :root)
  js/main.js       ← nav, scroll reveal, icons, form handling, config
  img/favicon.svg  ← site favicon
```

## Customizing

### Colors & fonts
Everything is driven by CSS custom properties at the top of `assets/css/styles.css` (`:root`). Change the palette once (orange / teal / blue / neutrals) and the whole site updates.

### Content & copy
Each page is a single HTML file — find the section via its comment banner (`<!-- ======= Hero ======= -->`) and edit directly. The nav, footer, and forms are repeated per page (intentional — keeps the site build-free and easy to tweak per page).

### Images
Images use stable Unsplash URLs with sizing params (`?auto=format&fit=crop&w=800&q=60`). Swap any `<img src="…">` for your own photos. Icons are inline SVG (lucide-style) injected by JS — add or change them in the `ICONS` map in `assets/js/main.js` and reference with `<span data-icon="name">`.

### Forms (fake backend)
Forms are fully functional client-side:

- **Validation** — native HTML validation (`required`, `type="email"`, etc.).
- **Storage** — submissions are saved to `localStorage` under `apnathikana.submissions.v1` (open DevTools → Application → Local Storage to see them).
- **Real endpoint** — set `window.ApnaThikana.endpoint` in `assets/js/main.js` to a URL (your API, a Formspree endpoint, Google Apps Script, etc.) and submissions will POST there as JSON:

```js
window.ApnaThikana = window.ApnaThikana || {
  endpoint: "https://your-api.example.com/submit",
  storeLocal: true,
};
```

Form types (from `data-form` on each `<form>`): `waitlist`, `partner`, `contact`.

### Pre-selecting the waitlist role
Links can pre-select the role dropdown, e.g. `contact.html?role=student#waitlist`. Supported values: `student`, `working-professional`, `hostel-owner`, `mess-operator`, `furniture-owner`, `other` (loose matching: `?role=hostel` works too).

### Adding a page
1. Copy an existing page as a template.
2. Update `<title>`, meta description, the `is-active` nav link, and page content.
3. Add a matching `<li><a>` to the footer "Pages" column.

### SEO
Each page has a unique `<title>` and meta description; the home page includes Open Graph tags. Add your real domain to a `<link rel="canonical">` and swap `robots.txt` / `sitemap.xml` in when you go live.

## Local dev

Any static server works:

```bash
python3 -m http.server 8000
# or: npx serve
```

Open http://localhost:8000

## Roadmap (placeholder content)

2026 — idea & pilot in Pune &middot; 2027 — expand to more colleges & cities &middot; Future — full-fledged student living platform. All placeholder names, numbers, and social links are fake and ready to replace.