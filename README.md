# 🍽️ QuickServe – Restaurant Management System

A full-stack restaurant management system built to handle dine-in and takeout orders, table management, billing, and payments efficiently. Designed for speed, simplicity, and real-world restaurant workflows.

---

## 🚀 Features

- 🍽️ Create **Dine-in** and **Takeout** orders
- 🪑 Manage table status (Available / Occupied)
- 🛒 Add/remove items from cart with quantity control
- 🧾 Generate dynamic bills
- 💳 Process payments (Cash)
- 📋 View and manage active orders
- 🔄 Real-time UI updates
- ⚡ Fast and responsive interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- TypeScript
- HTML, CSS
- Fetch API

### Backend
- Node.js
- NestJS
- Prisma ORM
- PostgreSQL

---

## 📁 Project Structure
quickserve/
│
├── backend/ # Backend (NestJS API)
│ ├── src/
│ │ ├── orders/
│ │ ├── payments/
│ │ ├── menu/
│ │ ├── tables/
│ │ ├── prisma/
│ │ └── main.ts
│ └── prisma/
│ └── schema.prisma
│
├── frontend/ # React Frontend
│ ├── src/
│ │ ├── components/
│ │ │ ├── Menu.tsx
│ │ │ ├── Cart.tsx
│ │ │ ├── Bill.tsx
│ │ │ └── OrderScreen.tsx
│ │ └── App.tsx
│
└── README.md


---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quickserve.git
cd quickserve
```

2. Setup Database (PostgreSQL)
CREATE DATABASE quickserve_db;

Run migrations:
```
cd backend
npx prisma migrate dev
```

3. Setup Backend
```
cd backend
npm install
npm run start:dev
```
Backend runs on:
```
http://localhost:3000
```
4. Setup Frontend
```
cd frontend
npm install
npm start
```
Frontend runs on:
```
http://localhost:3001
```
🔗 API Endpoints
Orders
POST /orders → Create order (Dine-in / Takeout)
GET /orders → Get all orders
GET /orders/table/:id → Get open order by table
POST /orders/items → Add item
Payments
POST /payments → Complete payment
Tables
PATCH /tables/:id/status → Update status
Menu
GET /categories → Get menu

🧠 Architecture
Controllers → Services → Prisma → Database
🔥 Key Logic
tableId present → DINE_IN
tableId absent → TAKEOUT
Table auto updates status
Bill generated before payment
Payment completes order


🚀 Deployment

Backend → Render / Railway
Frontend → Vercel / Netlify

📌 Future Improvements
Authentication
Online payments
Analytics dashboard
Kitchen display system
Mobile UI improvements

👨‍💻 Author

Venkat
