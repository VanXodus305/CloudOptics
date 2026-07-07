# <div align="center"> CloudOptics</div>

<div align="center">
  <p align="center">
    <strong>Real-time Cloud Cost Optimization & Monitoring Platform</strong>
  </p>
</div>

---

##  Core Features

- **Real-Time Monitoring**: Track your active compute, database, and storage cloud spend as it incurs.
- **Automated Optimizations**: Scan connected infrastructures to terminate idle machines and flag oversized disk partitions.
- **3D Coverflow Highlights**: Interact with core platform modules through a smooth, responsive 3D card layout.
- **Dynamic Cost Simulation**: Simulate live cost anomalies and budget limits directly within the workspace.
- **Sliding Dark Mode System**: Transition the interface using a custom glassmorphic theme toggle switch.
- **AI Integration**: Incorporates **Gemini** (Gemini 1.5 Pro) for intelligent data insights.
- **AI-Assisted Development**: Built with the help of AI models including **Gemini** (1.5 Pro/Flash), **Claude** (3.5 Sonnet), and **ChatGPT** (GPT-4o) using the **Antigravity IDE**.

---

##  Technology Stack

### Frontend
The frontend is built for a highly interactive and dynamic user experience, utilizing modern web development practices.

**Tech Stack & Tools:**
- **Framework**: Next.js 15.2 (React 19.0)
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Architecture**: Next.js App Router for streamlined layouts and server components.
- **Features**: Responsive 3D layouts, glassmorphic UI, dynamic data visualization components, and sliding dark mode toggles.

### Backend
The backend is designed for high-performance data processing, ensuring real-time metrics aggregation and secure authentication.

**Tech Stack & Tools:**
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Next-Auth (Auth.js) v5 with Google OAuth integration
- **API layer**: Next.js Server Actions & API Routes
- **Features**: Programmatic APIs for metrics aggregation, automated cost optimization scanning, secure credential management, and simulated budget enforcement.

---

##  Deployment & Repository
- **GitHub**: The source code is hosted on GitHub.
- **Vercel**: The application is deployed on Vercel for seamless hosting and CI/CD integration.

##  Quick Start

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) installed and running locally.

### 2. Environment Variables

Create a `.env` file in the root directory of the project and populate it with the following configuration:

```env
# Database connection
MONGODB_URI=mongodb://localhost:27017/cloudoptics

# Authentication (Next-Auth)
AUTH_SECRET=your_auth_secret_here
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret

# Local Development Settings
BUDGET_LIMIT=5000
TEST_BYPASS_SECRET=your_secure_bypass_key
```

### 3. Installation & Database Seeding

Run the following commands to install dependencies, seed the database with initial metrics, and start the application:

```bash
# Install package dependencies
npm install

# Seed the database
npm run seed

# Run the local development server
npm run dev
```

The application will launch on **`http://localhost:3000`**.

---

> [!TIP]
> **Testing APIs Programmatically**
> You can test the backend aggregator APIs programmatically without authenticating via Google by passing the `x-bypass-auth` header matched to your local `TEST_BYPASS_SECRET`.
