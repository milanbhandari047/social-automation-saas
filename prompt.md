social-automation-saas/
│
├── apps/
│ │
│ ├── web/ # Next.js Frontend (Dashboard)
│ │ ├── app/
│ │ │ ├── (auth)/
│ │ │ │ ├── login/
│ │ │ │ ├── register/
│ │ │ │
│ │ │ ├── dashboard/
│ │ │ │ ├── page.tsx
│ │ │ │ ├── overview/
│ │ │ │ ├── posts/
│ │ │ │ ├── scheduler/
│ │ │ │ ├── analytics/
│ │ │ │
│ │ │ ├── accounts/
│ │ │ ├── create-post/
│ │ │ ├── settings/
│ │ │ ├── billing/
│ │ │ └── layout.tsx
│ │ │
│ │ ├── components/
│ │ │ ├── ui/
│ │ │ ├── post-editor/
│ │ │ ├── calendar/
│ │ │ ├── charts/
│ │ │ ├── navbar/
│ │ │ └── sidebar/
│ │ │
│ │ ├── lib/
│ │ ├── hooks/
│ │ ├── store/
│ │ ├── services/
│ │ ├── utils/
│ │ └── env.ts
│ │
│ │
│ ├── api/ # Node.js Backend API
│ │ ├── src/
│ │ │ ├── modules/
│ │ │ │ ├── auth/
│ │ │ │ │ ├── auth.controller.ts
│ │ │ │ │ ├── auth.service.ts
│ │ │ │ │ └── auth.routes.ts
│ │ │ │ │
│ │ │ │ ├── users/
│ │ │ │ ├── workspace/
│ │ │ │ ├── posts/
│ │ │ │ ├── social-accounts/
│ │ │ │ ├── scheduler/
│ │ │ │ ├── analytics/
│ │ │ │ └── billing/
│ │ │ │
│ │ │ ├── middlewares/
│ │ │ ├── services/
│ │ │ │ ├── meta.service.ts
│ │ │ │ ├── tiktok.service.ts
│ │ │ │ ├── ai.service.ts
│ │ │ │ ├── s3.service.ts
│ │ │ │
│ │ │ ├── utils/
│ │ │ ├── config/
│ │ │ ├── app.ts
│ │ │ └── server.ts
│ │
│ │
│ ├── worker/ # Background Jobs (IMPORTANT)
│ │ ├── src/
│ │ │ ├── queues/
│ │ │ │ ├── post.queue.ts
│ │ │ │
│ │ │ ├── jobs/
│ │ │ │ ├── publish-post.job.ts
│ │ │ │ ├── retry-post.job.ts
│ │ │ │
│ │ │ ├── processors/
│ │ │ │ ├── facebook.processor.ts
│ │ │ │ ├── instagram.processor.ts
│ │ │ │ ├── tiktok.processor.ts
│ │ │ │
│ │ │ ├── services/
│ │ │ ├── worker.ts
│ │ │ └── config.ts
│
│
├── packages/ # Shared code (IMPORTANT for SaaS)
│ │
│ ├── db/
│ │ ├── prisma/
│ │ │ ├── schema.prisma
│ │ │ ├── migrations/
│ │ │ └── client.ts
│ │
│ ├── ui/ # Shared UI components
│ │ ├── button.tsx
│ │ ├── modal.tsx
│ │ ├── input.tsx
│ │
│ ├── types/
│ │ ├── post.types.ts
│ │ ├── user.types.ts
│ │
│ ├── utils/
│ │ ├── date.ts
│ │ ├── logger.ts
│ │ ├── token.ts
│ │
│ └── config/
│ ├── env.ts
│ ├── constants.ts
│
│
├── services/ # External API integrations
│ ├── meta/
│ │ ├── facebook.ts
│ │ ├── instagram.ts
│ │
│ ├── tiktok/
│ │ ├── client.ts
│ │
│ ├── ai/
│ │ ├── openai.ts
│ │ ├── caption.generator.ts
│ │
│ ├── storage/
│ │ ├── s3.ts
│
│
├── prisma/ # Root prisma (optional sync)
│
├── docker/
│ ├── postgres/
│ ├── redis/
│
├── scripts/
│ ├── seed.ts
│ ├── deploy.ts
│
├── docs/
│ ├── architecture.md
│ ├── api-design.md
│
├── .env
├── package.json
├── turbo.json # Monorepo runner
└── README.md
