# Brian Moir — Portfolio

Personal portfolio of **Brian Moir** — AI & ML Engineer | DevOps & Solutions Engineer based in Knoxville, TN.

Built with Astro and Tailwind CSS with dark mode support.

## 🚀 Tech Stack

- **[Astro](https://astro.build)** — Static site generator
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first styling
- **TypeScript** — Type-safe scripting
- Responsive design and dark mode

## 📂 Structure

```
src/
├── assets/                  # Images, icons, CV
│   └── CV/CV_Brian_Moir.pdf
├── components/              # Header, Footer
├── layouts/                 # Base Layout (theme scripts)
├── pages/
│   ├── index.astro          # Home — summary, skills, CV download
│   ├── projects.astro       # Projects grid
│   ├── projects/[project].astro  # Dynamic project pages
│   ├── work.astro           # Work experience timeline
│   └── contact.astro        # Contact info and social links
├── project-descriptions/    # Markdown project content (English)
│   ├── Syncc-Agent-OS/
│   ├── Micro-Service-Builder/
│   ├── Content-Generation-Engine/
│   └── Marketing-Automation/
└── styles/global.css
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Contact form API (Cloudflare Pages + Neon) — build first, then local API
cp .dev.vars.example .dev.vars   # add your Neon DATABASE_URL
npm run pages:dev
```

## 📬 Contact form

Submissions are stored in **Neon Postgres** via a **Cloudflare Pages Function** at `POST /api/contact`.

1. Create a Neon database and run `db/migrations/001_contact_submissions.sql`.
2. Copy `.dev.vars.example` to `.dev.vars` and set `DATABASE_URL`.
3. Deploy with Cloudflare Pages (`npm run pages:deploy`) and add `DATABASE_URL` as a project secret.

The form appears on the home and contact pages. On GitHub Pages alone the UI renders, but submissions require Cloudflare Pages (or another host for `functions/`).

## ✍️ Adding a Project

Create a new folder in `src/project-descriptions/` with:

- `descripcion.en.md` (English)

Format:

```markdown
# Project Title
One-line summary of the project.

## Stack
Tech 1, Tech 2, Tech 3

## Links
[GitHub](https://github.com/...)
```

The project will automatically appear on the Projects page.

## 📬 Contact

- **Email:** bmoirdev@gmail.com
- **Phone:** 865-256-1516
- **Location:** Knoxville, TN
- **Certifications:** [credly.com/users/bmoir](https://credly.com/users/bmoir)
