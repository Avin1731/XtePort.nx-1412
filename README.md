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

### 🔔 Phase 5: Advanced Features & Engagement (Completed)
Goal: Upgrade Guestbook jadi Forum (Sidebar), Notifikasi, dan Email.
- [x] **Guestbook V2 (Forum UI):** Implementasi Topic Tags, Filtering, dan Sidebar Kanan.
- [x] **Admin Notif System:** Lonceng Header & Sidebar Badges (Inbox & Guestbook).
- [x] **Navigation UX:** Home link & Smart Admin Trigger di Navbar.
- [x] **Email Setup:** Setup Resend SDK & Domain verification.
- [x] **Reply System:** Admin balas pesan inbox -> Masuk email user (via Resend).

### 🚀 Phase 6: Guestbook V3 (Social Style) (Completed)
Goal: Interaksi 2 Arah, Like, Threaded Replies, & User Notifications.
- [x] **Database Upgrade:** Buat tabel `GuestbookReplies`, `GuestbookLikes`, & `UserNotifications`.
- [x] **Social UI (Frontend):** Tombol Like (Optimistic), Reply (Nested), & Thread View.
- [x] **User Notification Center:** Lonceng Notifikasi di Navbar User & Realtime updates.
- [x] **Email Loop:** Notifikasi email saat user lain membalas komentar (Fixed via Manual Query).

### 🛡️ Phase 7: Admin Social Management (Completed)
Goal: Kontrol penuh Admin terhadap fitur sosial baru & Interaksi Official.
- [x] **Admin Dashboard Integration:** Integrasi tab khusus & Thread Sheet UI dengan Post Highlight.
- [x] **Moderation:** Admin bisa menghapus balasan toxic tanpa menghapus induk postingan.
- [x] **Thread View:** Admin bisa melihat konteks percakapan penuh (Parent Post + Replies).
- [x] **Official Reply:** Admin reply via Dashboard -> Mengirim email "Official Response" ke user.
- [x] **UX Polish:** Hide Chatbot di Dashboard & Perbaikan layout email templates.

### 📝 Phase 8: Dynamic Content Engine (Feature-Based) (Current Focus)
Branch: feat/dynamic-content Goal: Migrasi konten statis menjadi dinamis (Database) secara bertahap per fitur.

#### A. The Blog Engine (First Priority)
Fokus: Membangun sistem artikel dari nol (Database -> Admin -> Public).
- [x] **DB Schema:** Membuat tabel `posts` (Title, Slug, Content, Tags, Published Status).
- [x] **Server Actions:** Membuat `src/actions/blog.ts` untuk Create, Read, Update, Delete artikel.
- [x] **Admin CMS:** Membuat halaman Dashboard `/dashboard/blog` (List) dan `/dashboard/blog/new` (Editor).
- [x] **Public Page (List):** Membuat halaman `/blog` untuk menampilkan daftar artikel terbaru dari DB.
- [x] **Public Page (Detail):** Membuat halaman `/blog/[slug]` untuk membaca artikel full.

#### B. The Profile & About Engine (Second Priority)
Fokus: Membuat halaman About/CV dinamis agar mudah update experience/bio.
- [ ] **DB Schema:** Membuat tabel `profile` (Bio, Avatar) dan `experience` (Work History).
- [ ] **Server Actions:** Membuat `src/actions/profile.ts` untuk update Bio dan CRUD Experience.
- [ ] **Admin CMS:** Membuat halaman Dashboard `/dashboard/profile` untuk form edit profile & timeline.
- [ ] **Public Page:** Refactor halaman `/about` agar merender data timeline dari Database.

#### C. Projects Dynamic Integration (Third Priority)
Fokus: Menghapus dummy data di halaman Projects dan menghubungkannya ke DB yang sudah ada.
- [ ] **Refactor Frontend:** Menghapus array statis di `src/app/projects/page.tsx`.
- [ ] **Data Fetching:** Mengganti logika render dengan `db.query.projects.findMany()`.
- [ ] **Final Check:** Memastikan gambar dan link project tampil benar dari database.

#### D. Optional Enhancements
- [ ] **Global Search:** Pencarian sederhana untuk memfilter Blog dan Projects sekaligus.

### ✨ Phase 9: Polish & SEO
Branch: feat/polish-seo Goal: Finishing touches, SEO, dan performa sebelum rilis.
[ ] SEO Meta: Setup Metadata API (Title, Desc, OpenGraph/Twitter Cards) dinamis per halaman.
[ ] Loading States: Skeleton Loading untuk UX lebih halus saat fetch data (Projects/Blog/Guestbook).
[ ] Error Handling: Custom 404 (Not Found) dan 500 (Error) pages yang estetik.
[ ] Mobile Check: Final fix responsiveness di HP kentang.
[ ] Final Release: Merge semua ke main dan production deploy.

### 🔮 Phase 10: Future Expansion
Branch: feat/future-expansion Goal: Upgrade kecerdasan (AI), Integrasi API Pihak Ketiga, & Skalabilitas.
[ ] AI RAG Chatbot: Ganti FAQ statis dengan AI (OpenAI/Gemini).
[ ] Spotify/GitHub Widget: Widget real-time "Now Playing" & "Recent Commits".
[ ] Internationalization (i18n): Dukungan dua bahasa (ID/EN).
[ ] Testing Suite: Unit Testing (Jest) atau E2E (Playwright).
[ ] PWA: Installable Web App.

## 🛠️ Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **UI Library:** shadcn/ui, Lucide React, Sonner (Toast)
* **Animation:** Framer Motion
* **Database:** PostgreSQL (Neon) + Drizzle ORM
* **Auth:** Auth.js (NextAuth v5)
* **Email:** Resend API + React Email
* **Utils:** Date-fns, Recharts (Stats)

## 📂 Folder Structure
* `src/app` - Pages & Routes (App Router).
* `src/actions` - Server Actions (Backend Logic).
* `src/components/ui` - Shadcn atomic components.
* `src/components/layout` - Navbar, Footer, Sidebar.
* `src/components/dashboard` - Admin specific components (Forms, Tables).
* `src/components/emails` - React Email templates.
* `src/components/home` - Landing page sections.
* `src/components/animation` - Reusable motion wrappers.
* `src/lib` - Utilities, DB config & Auth setup.
* `src/db` - Drizzle schema & migrations.

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
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

# NEXT_PUBLIC_APP_URL untuk konfigurasi URL aplikasi
# saat deploy ke Vercel atau platform lain
# NEXT_PUBLIC_APP_URL="https://..."
# atau saat local
NEXT_PUBLIC_APP_URL="http://localhost:3000"

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
# or
npm run dev
```
Open http://localhost:3000 with your browser to see the result.