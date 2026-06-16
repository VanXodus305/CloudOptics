# <div align="center">☁️ CloudOptics</div>

<div align="center">
  <p align="center">
    <strong>Real-time Cloud Cost Optimization & Monitoring Platform</strong>
  </p>

  ![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
  ![Next-Auth](https://img.shields.io/badge/Auth-Next--Auth%20v5-000000?style=for-the-badge&logo=next.js)
  ![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-FF00BF?style=for-the-badge&logo=framer&logoColor=white)
</div>

---

## ⚡ Core Features

- **Real-Time Monitoring**: Track your active compute, database, and storage cloud spend as it incurs.
- **Automated Optimizations**: Scan connected infrastructures to terminate idle machines and flag oversized disk partitions.
- **3D Coverflow Highlights**: Interact with core platform modules through a smooth, responsive 3D card layout.
- **Dynamic Cost Simulation**: Simulate live cost anomalies and budget limits directly within the workspace.
- **Sliding Dark Mode System**: Transition the interface using a custom glassmorphic theme toggle switch.

---

## 🚀 Quick Start

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
