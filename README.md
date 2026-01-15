<div align="center">
  <!-- Small icons row (compact, top-of-readme) -->
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=000" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=fff" />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=fff" />
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwindcss&logoColor=fff" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=fff" />
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=fff" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=000" />
  <img alt="Google Cloud" src="https://img.shields.io/badge/Google%20Cloud-4285F4?style=flat&logo=googlecloud&logoColor=fff" />
  <img alt="Mocha" src="https://img.shields.io/badge/Mocha-8D6748?style=flat&logo=mocha&logoColor=fff" />
  <img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=fff" />
  <img alt="GitHub Actions" src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=githubactions&logoColor=fff" />
  <img alt="Perl" src="https://img.shields.io/badge/Perl-39457E?style=flat&logo=perl&logoColor=fff" />

  <br/><br/>

  # 🎰 SlotLab

  <img alt="SlotLab Banner" src="https://img.shields.io/badge/SlotLab-Premium%20Slot%20Machine%20Analytics-gold?style=for-the-badge" />

  **A full-stack slot machine + analytics lab with real-time dashboards, Monte Carlo simulations, and multi-format exports (JSON/XML/CSV).**

  <a href="https://slotlab-4bc1e.web.app">
    <img alt="Live Demo" src="https://img.shields.io/badge/🚀%20Live%20Demo-slotlab--4bc1e.web.app-blue?style=for-the-badge" />
  </a>
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  </a>
  <a href="https://firebase.google.com">
    <img alt="Powered by Firebase" src="https://img.shields.io/badge/Powered%20by-Firebase-orange?style=for-the-badge&logo=firebase" />
  </a>
</div>

---

## 🧠 What SlotLab Is

SlotLab turns a classic slot machine into a probability + performance analytics platform. You can **play**, **track outcomes**, **analyze symbol distributions**, and **run large Monte Carlo simulations** to study ROI, streaks, and payout behavior—like a mini casino-research lab.

---

## ✨ Highlights

- 🎲 **Realistic slot engine** with weighted symbols + configurable paylines  
- 📊 **Analytics dashboard** with ROI, win-rate, streaks, and distribution tracking  
- 🔬 **Monte Carlo lab** (100 → 1,000,000 trials) for probability & payout analysis  
- 🔐 **Firebase Auth** + user-isolated data storage  
- 💾 **Exports**: JSON / XML / CSV + **Perl scripts** for ETL & reporting  
- 📱 **Responsive UI** built for desktop and mobile  
- 🧪 **Mocha/Chai** tests for engine correctness & statistical sanity checks  

---

## 🧰 Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS, Lucide, Recharts  
**Backend:** Node.js, Express, Firebase Admin SDK  
**Database/Platform:** Firebase Auth, Firestore, Firebase Hosting (optional Functions / Render / Railway)  
**Data/Tooling:** JSON/XML/CSV exports, Perl scripts, ESLint, GitHub Actions  

---

## 🏗️ Architecture (High-Level)

```text
React Client (Game + Dashboard + Simulation)
        |
        |  Firebase Auth (ID Token)
        v
Express API (JWT verification, engine execution, exports)
        |
        v
Firestore (users, spins, aggregated stats)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended 20.x)
- npm 9+
- Firebase project (free tier)
- Perl 5.x (for scripts)

### Install
```bash
git clone https://github.com/yourusername/slotlab.git
cd slotlab

cd server && npm install
cd ../client && npm install
```

### Firebase Setup
```bash
firebase login
firebase init
```

### Configure Firebase

**Client:** `client/src/lib/firebase.ts`
```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

**Server:** place `firebase-service-account.json` in `server/` and set:

```bash
# server/.env
GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json
PORT=5001
NODE_ENV=development
```

### Run Locally

**Backend**
```bash
cd server
npm run dev
# http://localhost:5001
```

**Frontend**
```bash
cd client
npm run dev
# http://localhost:3000
```

---

## 🔌 API (Summary)

**Auth header**
```text
Authorization: Bearer <firebase-id-token>
```

**Endpoints**
- `POST /init` — create/retrieve user profile + initial balance  
- `POST /spin` — run a spin + persist result + update stats  
- `GET  /stats` — aggregate stats + recent spins  
- `POST /simulate` — Monte Carlo simulation  
- `GET  /export/json` — export as JSON  
- `GET  /export/xml` — export as XML  

---

## 🧾 Data Export & Perl Scripts

Install Perl modules:
```bash
cpan JSON
cpan XML::Simple
```

Run scripts:
```bash
perl scripts/analyze_spins.pl slotlab-export.json
perl scripts/export_to_csv.pl export.json output.csv
perl scripts/json_to_xml.pl input.json output.xml
perl scripts/compare_sessions.pl session1.json session2.json
```

---

## 🧪 Testing

```bash
cd server
npm test
```

---

## 🌍 Deployment

### Frontend (Firebase Hosting)
```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

### Backend (choose one)
- Firebase Cloud Functions: `firebase deploy --only functions`
- Render/Railway: deploy `server/` + set env vars + update client API base URL

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

## 👤 Author

**Mahir Ahmed**  
- Live: https://slotlab-4bc1e.web.app  
- GitHub: https://github.com/yourusername  
- LinkedIn: https://linkedin.com/in/yourprofile  
- Email: your.email@example.com

<div align="center">
  <br/>
  <img alt="Stars" src="https://img.shields.io/github/stars/yourusername/slotlab?style=social" />
  <img alt="Forks" src="https://img.shields.io/github/forks/yourusername/slotlab?style=social" />
  <img alt="Watchers" src="https://img.shields.io/github/watchers/yourusername/slotlab?style=social" />
  <br/><br/>
  <b>Built with ❤️ using modern web technologies</b>
</div>
