# A-1412 Project

Dynamic Interactive Portfolio System.
Built with Next.js 16, Tailwind v4, and Shadcn UI.

## 🗺️ Roadmap Progress

### 📦 Phase 0: Init Setup (Completed)
Goal: Pondasi project, repo ready, deployment sukses.
- [x] **Init Project:** Create Next.js app, setup TypeScript, ESLint.
- [x] **UI Base:** Install Tailwind CSS v4, utility, setup Shadcn/UI.
- [x] **Assets & Fonts:** Setup folder `public`, import font (Geist).
- [x] **Deployment:** Push ke GitHub & Connect ke Vercel (Production Ready).

### 🎨 Phase 1: UI & Animation (Completed)
Goal: Tampilan visual, layouting, dark mode, dan animasi "PPT".
- [x] **Theme System:** Dark/Light mode toggle (`next-themes`).
- [x] **Global Layout:** Responsive Navbar (Sticky) & Footer.
- [x] **Animation Engine:** Framer Motion setup & `FadeIn` wrapper.
- [x] **Landing Page:** Hero Section with text reveal animation.
- [x] **Highlights:** Scrollable Tech Stack & About sections.
- [x] **CTA:** Download CV & Contact section.

### 🧠 Phase 2: Auth & Database (Upcoming)
Goal: Otak backend, koneksi database, sistem login, dan CMS Schema.
- [ ] **DB Setup:** Setup Neon (PostgreSQL) & Connection String.
- [ ] **ORM Config:** Install Drizzle ORM & Schema setup (Projects, Tech, Profile).
- [ ] **Auth:** Setup Auth.js (v5) dengan Google OAuth.
- [ ] **Migrations:** Push schema database pertama.

## 🛠️ Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **UI Library:** shadcn/ui
* **Animation:** Framer Motion
* **Database:** PostgreSQL (Neon) + Drizzle ORM (Coming Soon)
* **Auth:** Auth.js / NextAuth (Coming Soon)

## 📂 Folder Structure
* `src/app` - Pages & Routes (App Router).
* `src/components/ui` - Shadcn atomic components.
* `src/components/layout` - Navbar, Footer, Sidebar.
* `src/components/home` - Landing page sections (Hero, TechStack, etc).
* `src/components/animation` - Reusable motion wrappers.
* `src/lib` - Utilities & Configuration.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install