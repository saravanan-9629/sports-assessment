# 🏆 AI-Powered Mobile Platform for Democratizing Sports Talent Assessment

A complete, mobile-first full-stack sports technology platform designed to make athletic talent assessment affordable, accessible, and objective for athletes, coaches, and scouts worldwide.

---

## 🌟 Key Features

1. **Mobile-First & Accessible Scouting**: No expensive laboratory hardware needed. Athletes log verified physical and technical metrics using standard smartphone devices.
2. **Multi-Sport Support**: Tailored assessment algorithms for **Cricket**, **Football**, **Basketball**, and **Athletics**.
3. **Normalized AI Performance Scoring**: Computes standardized 0–100 attribute sub-scores (Speed, Agility, Endurance, Strength, Skill) and assigns performance tiers (**Beginner**, **Intermediate**, **Advanced**, **Elite**).
4. **Modular AI Analysis Engine (`AIAnalysisService`)**: Generates structured AI talent breakdowns, pinpoints limiters, and prescribes multi-week drill regimens. Structured for seamless plug-and-play integration with OpenAI/Claude APIs.
5. **National Leaderboards**: Ranked standings filtered by sport, age group (U16, U20, 21+), and geographic location.
6. **Coach & Scout Portal**: Search, filter, inspect verified athlete radars, shortlist top prospects, and submit official scouting evaluations.
7. **Admin Telemetry Console**: System governance, activity monitoring, and user role management (`ATHLETE`, `COACH`, `ADMIN`).

---

## 📁 Project Structure

```
Sports talent/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & app constants
│   │   ├── models/          # User, AthleteProfile, Assessment, AIRecommendation, CoachFeedback
│   │   ├── services/        # ScoringService & AIAnalysisService
│   │   ├── controllers/     # Auth, Assessment, Leaderboard, Coach, Admin controllers
│   │   ├── routes/          # Express REST API routes
│   │   ├── middleware/      # JWT auth & Role-Based authorization
│   │   ├── seed.ts          # Database seeding script with realistic demo data
│   │   └── server.ts        # Express entry server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # ScoreRing, Badge, StatCard, Navbar, MobileNav
│   │   ├── context/         # AuthContext with instant 1-click Demo Logins
│   │   ├── pages/           # Landing, Login, Register, Dashboard, Assessment, Results, History, Leaderboard, Recommendations, Coach, Admin
│   │   ├── services/        # Frontend API client
│   │   ├── types/           # TypeScript definitions
│   │   ├── App.tsx          # React Router setup
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .env.example
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (Local instance or MongoDB Atlas URL)

---

### 1. Backend Setup

```bash
cd backend
npm install
npm run seed     # Populate database with demo athletes, coaches & combine metrics
npm run dev      # Starts Express backend on http://localhost:5000
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:3000
```

---

## 🔑 One-Click Demo Accounts

For fast evaluation, the application includes pre-configured 1-click demo logins on the Login page and Navbar:

* **Athlete Mode**: `athlete@sportstalent.ai` (Password: `password123`)
* **Coach Mode**: `coach@sportstalent.ai` (Password: `password123`)
* **Admin Mode**: `admin@sportstalent.ai` (Password: `password123`)

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` in `backend/` and configure:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sports_talent_ai
JWT_SECRET=sports_talent_super_secret_jwt_key_2026
```
