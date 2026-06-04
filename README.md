# 🔬 Research Copilot

Research Copilot is an AI-powered assistant designed to streamline academic and scientific literature reviews. It allows users to upload research papers in PDF format, generate structured summaries, compare methodologies and findings side-by-side, search paper content, and query individual papers using a specialized QA chat interface.

Built using **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, and the **GitHub Models Inference API** (via Vercel AI SDK and OpenAI compatibility layers).

---

## ✨ Key Features

- 📄 **PDF Upload & Text Extraction**: Seamlessly upload research papers in PDF format, extracting up to 12,000 characters of text for immediate analysis.
- 🤖 **Structured AI Summaries**: Automatically parses the paper to generate detailed summaries, highlighting:
  - **TL;DR**: A high-level overview.
  - **Key Points**: Critical takeaways and methodologies.
  - **Important Findings**: Core results and experimental outcomes.
- 💬 **Interactive Q&A Chat**: Converse with individual research papers. Choose from suggested questions (e.g., methodology, datasets, limitations) or input your own.
- 🔄 **Paper Comparison Matrix**: Select two research papers to compare side-by-side and let the AI compile a comprehensive review on:
  - Similarities & Differences
  - Strengths & Weaknesses
  - Overall Verdict
- 🔍 **Universal Database Search**: Rapidly find papers using full-text searches matching titles, summaries, or extracted contents.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database ORM**: [Prisma](https://www.prisma.io/) with **PostgreSQL** (hosted on [Neon DB](https://neon.tech/))
- **AI Core**: [GitHub Models API](https://github.com/marketplace/models) (configured with `openai/gpt-4.1-mini`)
- **PDF Processing**: [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- **Formatting & Style**: Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/) components, React Markdown, and Remark GFM for markdown formatting in reports.

---

## ⚙️ Prerequisites & Environment Setup

Before running the application, make sure you have **Node.js (v18+)** and a **Neon DB (PostgreSQL)** database set up.

Create a `.env` file in the root directory by duplicating the example file:
```bash
cp .env.example .env
```

Define the following environment variables in `.env`:
```env
# Neon PostgreSQL database connection URL
DATABASE_URL="postgresql://neondb_owner:your_neon_password@ep-random-subdomain.us-east-2.aws.neon.tech/neondb?sslmode=require"

# GitHub Token for accessing GitHub Models Inference API
# Get one from: https://github.com/settings/tokens
GITHUB_TOKEN="your_github_personal_access_token"
```

---

## 🚀 Quick Start

Follow these steps to run the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sheikh-mohammad-rakib/research-copilot.git
   cd research-copilot
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Initialize the Database Schema**
   Sync your database schema with Prisma (creates tables and relationships):
   ```bash
   npx prisma db push
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to start analyzing your research papers.

---

## 📂 Project Structure

```
research-copilot/
├── app/                  # Next.js pages, API endpoints, and layouts
│   ├── api/              # API endpoints (ask, compare, papers, search, upload)
│   ├── compare/          # Compare UI route
│   ├── comparisons/      # Comparison history list
│   ├── papers/           # Uploaded papers list & detailed paper Q&A view
│   ├── search/           # Multi-field database query UI
│   └── upload/           # PDF drag-and-drop / upload screen
├── components/           # Reusable UI parts & custom hooks
│   ├── ui/               # Base shadcn component configurations (e.g., button.tsx)
│   ├── paper-chat.tsx    # Chat widget for individual paper query sessions
│   └── theme-provider.tsx# Light/dark mode configurations
├── lib/                  # Shared configuration wrappers
│   ├── ai.ts             # GitHub Models client configuration
│   ├── db.ts             # Prisma client database initializer
│   └── utils.ts          # Tailwind CSS merge utilities
├── prisma/               # Prisma database schema definition
│   └── schema.prisma     # Paper & Comparison relation schema
└── public/               # Public assets & icons
```

---

## 🔒 Security & Usage

This project uses the **GitHub Models Inference API** which allows access to leading models. Ensure that:
- Your `GITHUB_TOKEN` is kept safe and never committed to source control.
- Large PDF documents are parsed within token boundaries (automatically capped at 12,000 characters in the prompt to prevent API usage limits).
