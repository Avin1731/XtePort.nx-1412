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

### 🧠 Phase 2: Auth & Database (Completed)
Goal: Otak backend, koneksi database, sistem login, dan CMS Schema.
- [x] **DB Setup:** Setup Neon (PostgreSQL) & Connection String.
- [x] **ORM Config:** Install Drizzle ORM & Schema setup (Projects, Tech, Profile).
- [x] **Auth:** Setup Auth.js (v5) dengan Google OAuth.
- [x] **Migrations:** Push schema database pertama & Login UI.

### 🛡️ Phase 3: Dashboard & Content Control (Completed)
Goal: Dashboard admin, CMS Portfolio, dan Tracking Pengunjung.
- [x] **Role Setup:** Set role 'admin' manual di database (Drizzle Studio).
- [x] **Middleware:** Proteksi route `/dashboard` (Hanya email owner yang boleh akses).
- [x] **Admin Layout:** Buat Sidebar dan Layout khusus Dashboard admin (No Scrollbars).
- [x] **Visitor Tracking:** Server action untuk catat IP dan User Agent saat page load.
- [x] **Dashboard Stats:** UI kartu statistik (Total Visitors, Total Projects) & Tabel Visitor Log.
- [x] **CMS Project:** CRUD tabel `projects` (Tambah/Edit portfolio dari UI).
- [x] **CMS Tech Stack:** CRUD tabel `tech_stack` (Manage skill icon).

### 💬 Phase 4: Interactive & Community (Completed)
Goal: Chatbot widget, Guestbook, dan Message System.
- [x] **Guestbook:** Fitur komentar publik sederhana (Buku Tamu) dengan auth.
- [x] **Admin Guestbook:** Moderasi pesan masuk (Hapus pesan spam/kasar).
- [x] **Chat Widget UI:** Floating Action Button, Animations, & Glassmorphism UI.
- [x] **FAQ Logic:** Logic chatbot sederhana (pilih pertanyaan -> muncul jawaban).
- [x] **Message System:** Server Action untuk User post pesan privat ke database.
- [x] **Admin Inbox:** Dashboard UI untuk membaca dan menghapus pesan masuk.

### 🔔 Phase 5: Advanced Features & Engagement (In Progress)
Goal: Upgrade Guestbook jadi Forum (Sidebar), Notifikasi, dan Email.
- [ ] **Guestbook V2 (Forum Logic):** Implementasi Topic Tags, Filtering, dan Sidebar Kanan.
- [ ] **Admin Notif:** Indicator (badge merah) saat ada pesan/guestbook baru.
- [ ] **Email Setup:** Setup Resend SDK & Domain verification.
- [ ] **Reply System:** Fitur reply pesan dari dashboard admin.
- [ ] **Email Trigger:** Otomatis kirim email notifikasi ke user saat admin membalas.

### ✨ Phase 6: Polish & SEO
Goal: Finishing touches, SEO, dan performa.
- [ ] **SEO Meta:** Setup Metadata API (Title, Desc, OpenGraph).
- [ ] **Loading States:** Skeleton Loading untuk UX lebih halus.
- [ ] **Error Handling:** Custom 404 dan Error pages.
- [ ] **Mobile Check:** Final fix responsiveness.
- [ ] **Final Release:** Merge ke main dan production deploy.

## 🛠️ Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **UI Library:** shadcn/ui, Lucide React
* **Animation:** Framer Motion
* **Database:** PostgreSQL (Neon) + Drizzle ORM
* **Auth:** Auth.js (NextAuth v5)
* **Utils:** Date-fns, Recharts (Stats)

## 📂 Folder Structure
* `src/app` - Pages & Routes (App Router).
* `src/actions` - Server Actions (Backend Logic).
* `src/components/ui` - Shadcn atomic components.
* `src/components/layout` - Navbar, Footer, Sidebar.
* `src/components/dashboard` - Admin specific components (Forms, Tables).
* `src/components/home` - Landing page sections.
* `src/components/animation` - Reusable motion wrappers.
* `src/lib` - Utilities, DB config & Auth setup.
* `src/db` - Drizzle schema & migrations.

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Environment Variables
Create a .env file in the root directory and add the following keys:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:..."

# Auth Secret (Generate random string for encryption)
AUTH_SECRET="your_secret_key_random_string"

# Google OAuth (For Login)
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"

# Admin Access
ADMIN_EMAIL="your_email@gmail.com"

# Email Service (Resend)
RESEND_API_KEY="re_123..."
```

### 3. Database Migration
Push the schema to your Neon database to create tables:

```bash
npx drizzle-kit push
```
### 4. Run Development Server
Start the local server:

```bash
pnpm dev
Open http://localhost:3000 with your browser to see the result.
```