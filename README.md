# 🚀 Social Automation SaaS

A full-stack SaaS platform for social media scheduling, automation, and analytics — supporting **Facebook**, **Instagram**, and **TikTok**.

> ⚠️ **Status: Project Setup / Early Development** — monorepo scaffolding in place, features under active planning.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) |
| Backend | Node.js + Express |
| Database | Packages via `packages/db` |
| Monorepo | Turborepo + pnpm workspaces |
| Language | TypeScript (66.8%) + JavaScript (33.2%) |

---

## 🗂️ Project Structure

```
social-automation-saas/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Node.js + Express backend
├── packages/
│   └── db/           # Shared database package (Prisma / Drizzle)
├── turbo.json        # Turborepo pipeline config
├── pnpm-workspace.yaml
├── package.json
├── TODO.md           # Project task tracker
├── task.md           # Development tasks
└── prompt.md         # AI/LLM prompt configs
```

---

## ✨ Planned Features

### 📅 Social Media Scheduling
- Schedule posts across Facebook, Instagram, and TikTok
- Bulk upload and calendar view
- Best-time-to-post suggestions

### 🤖 Automation
- Auto-reply to comments and DMs
- Rule-based triggers (e.g., keyword → response)
- Workflow builder for repetitive tasks

### 📊 Analytics & Reporting
- Engagement metrics per platform
- Audience growth tracking
- Exportable reports (PDF / CSV)

### 🔗 Supported Platforms
- 📘 Facebook (Pages & Groups)
- 📸 Instagram (Feed, Reels, Stories)
- 🎵 TikTok (Videos & Duets)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js `>= 18`
- pnpm `>= 8`

```bash
npm install -g pnpm
```

### Installation

```bash
# Clone the repo
git clone https://github.com/milanbhandari047/social-automation-saas.git
cd social-automation-saas

# Install dependencies
pnpm install
```

### Running the Dev Servers

```bash
# Run all apps in parallel (Turborepo)
pnpm dev

# Or run individually
pnpm --filter web dev       # Next.js frontend
pnpm --filter api dev       # Express backend
```

---

## 🔐 Environment Variables

Create `.env` files in each app:

**`apps/api/.env`**
```env
PORT=4000
DATABASE_URL=your_database_url

# Facebook
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# Instagram
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=

# TikTok
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 📋 Roadmap

- [ ] Project scaffolding & monorepo setup ✅
- [ ] Database schema design
- [ ] OAuth integration (Facebook, Instagram, TikTok)
- [ ] Post scheduling API
- [ ] Frontend dashboard UI
- [ ] Automation engine
- [ ] Analytics pipeline
- [ ] Billing & subscription (Stripe)
- [ ] Deployment setup

---

## 🤝 Contributing

This project is in early development. Contributions, suggestions, and feedback are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a PR

---

## 📄 License

MIT © [Milan Bhandari](https://github.com/milanbhandari047)
