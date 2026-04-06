# Medborgerskabsprøven — practice quiz

**Live app:** [https://keithmchd48.github.io/medborgerskabsproven-quiz/](https://keithmchd48.github.io/medborgerskabsproven-quiz/)

## What this app is

This is a small practice tool for people studying for **Denmark’s citizenship test** (*medborgerskabsprøven*). You get short quizzes made of multiple-choice questions. The **questions, answer choices, and explanations are in Danish**, so you can study in the same language as the real exam. The **user interface** (buttons, labels, instructions) is in **English**, so it stays easy to navigate if you are more comfortable reading English than Danish.

Each quiz picks **25 questions at random** from a larger pool. You answer one question at a time, then see your score at the end. If you get anything wrong, the app shows those items again with the **correct answer** and a **short explanation** in Danish, so you can learn from mistakes.

The quiz content is based on the official teaching material **“Læremateriale til medborgerskabsprøven”** — **Demokrati og hverdagsliv i Danmark**, **August 2024** edition, published by **SIRI** (*Styrelsen for International Rekruttering og Integration*, the Danish Agency for International Recruitment and Integration). This app is an independent study aid; it is **not** produced or endorsed by SIRI.

---

## Technical overview

| Item | Details |
|------|---------|
| Stack | Vue 3, TypeScript, Vite, Tailwind CSS |
| Runtime | Runs entirely in the browser (static frontend; no backend server) |
| Version | [Semantic Versioning 2.0.0](https://semver.org/) (`MAJOR.MINOR.PATCH`); see **Versioning** |

### Requirements

- **Node.js** (a current LTS version, e.g. 20 or 22) and **npm**

### Install dependencies

From the project folder:

```bash
npm install
```

### Run locally (development)

```bash
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

### Build for production

```bash
npm run build
```

Output is written to the `dist/` folder. You can deploy that folder to any static host.

### Preview the production build locally

```bash
npm run preview
```

### Regenerating question data (optional)

Question text is generated from a parsed copy of the source material. If you update `scripts/source.txt` and want to refresh `src/data/questions.json`, run:

```bash
node scripts/build-questions.mjs
```

Run this from the **project root** (the same directory as `package.json`).

### Versioning

This project follows **semantic versioning**: **`MAJOR.MINOR.PATCH`** ([spec](https://semver.org/)).

| Segment | When to bump |
|--------|----------------|
| **MAJOR** | Breaking changes (e.g. incompatible UX, removed features, new requirements for users) |
| **MINOR** | New functionality that stays backward compatible |
| **PATCH** | Bug fixes and small compatible improvements |

- **Source of truth:** the `version` field in **`package.json`** (also written into the built app as **`VITE_APP_VERSION`**, shown in the footer as `v1.2.3`).
- **History:** update **`CHANGELOG.md`** when you release (see [Keep a Changelog](https://keepachangelog.com/)).

**Bump the version** (updates `package.json` and `package-lock.json`; does **not** create a git commit):

```bash
npm run release:patch   # 1.0.0 → 1.0.1
npm run release:minor   # 1.0.0 → 1.1.0
npm run release:major   # 1.0.0 → 2.0.0
```

Then commit the version bump and changelog, tag if you like, and push (GitHub Actions will deploy the new build):

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore(release): v1.0.1"
git tag v1.0.1   # optional
git push origin main --follow-tags
```

---

## Deploy on GitHub Pages

### 1. Put the project on GitHub

1. Create a **new repository** on GitHub (empty, no README required).
2. In your project folder on your computer:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repository name.

### 2. Turn on GitHub Pages with Actions

1. On GitHub, open the repo → **Settings** → **Pages** (under “Code and automation”).
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).

### 3. Deploy

The workflow **`.github/workflows/deploy-github-pages.yml`** runs on every push to **`main`**. After the first successful run:

1. Open the **Actions** tab and confirm the workflow is green.
2. Under **Settings → Pages**, copy the **site URL** (for a normal project repo it looks like `https://YOUR_USERNAME.github.io/YOUR_REPO/`).

It can take one or two minutes after the job finishes before the site updates.

### Base path (how assets load)

Production builds use **`VITE_BASE_URL`** so links and scripts work under a subpath:

| Repository type | Example URL | `VITE_BASE_URL` |
|-----------------|-------------|-----------------|
| Normal project repo | `https://user.github.io/quiz-app/` | `/quiz-app/` (set automatically in CI) |
| User Pages repo named `user.github.io` | `https://user.github.io/` | `/` (set automatically in CI) |

The workflow sets this for you. To **build locally** the same way as GitHub Pages for a project repo named `my-quiz`:

```bash
VITE_BASE_URL=/my-quiz/ npm run build
npm run preview
```

### Private repositories

GitHub Pages for **private** repos is only available on **paid** GitHub plans. For **zero cost**, keep the repository **public**, or use another free host for private repos.
