# 🍽️ QuickServe – Restaurant Management System

A full-stack restaurant management system designed to handle real-world restaurant workflows including dine-in, takeout, billing, authentication, and analytics. Built for speed, scalability, and clean user experience.
cdsvd
---

## 🚀 Features

### 🧾 Order Management

* Create **Dine-in** and **Takeout** orders
* Add/remove items with quantity control
* Automatic order type detection
* Real-time cart updates

### 🪑 Table Management

* View all restaurant tables
* Track table status (**Available / Occupied / Reserved**)
* Auto-update table status on order creation

### 💳 Billing & Payments

* Generate dynamic bills
* Calculate totals automatically
* Complete payments (Cash)
* Reset system after payment

### 🔐 Authentication (OAuth)

* Google OAuth login
* Role-based access (**Manager / Employee**)
* Secure JWT authentication (stored in cookies)
* Protected routes (Analytics & History only for Manager)

### 📊 Analytics & History

* View order analytics (Manager only)
* Filter order history by:

  * Date
  * Order Type (Dine-in / Takeout)
  * Status
* Backend-powered reporting

### ⚡ UI/UX

* Fast and responsive interface
* Toast notifications for actions
* Clean component-based design
* Non-inline CSS structure

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* TypeScript
* CSS (modular structure)
* Fetch API

### Backend

* Node.js
* NestJS
* Prisma ORM
* PostgreSQL
* Passport.js (Google OAuth)
* JWT Authentication

---

## 📁 Project Structure

```
quickserve/
│
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # Authentication (OAuth + JWT)
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── analytics/
│   │   ├── tables/
│   │   ├── prisma/
│   │   └── main.ts
│   └── prisma/
│       └── schema.prisma
│
├── frontend/                # React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── TableList.tsx
│   │   │   ├── OrderScreen.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── OrderHistory.tsx
│   │   │   └── Login.tsx
│   │   ├── css/
│   │   └── App.tsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/VenkatM77797/quickserve.git
cd quickserve
```

---

### 2. Setup Database (PostgreSQL)

```sql
CREATE DATABASE quickserve_db;
```

Run migrations:

```bash
cd backend
npx prisma migrate dev
```

---

### 3. Setup Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on:

```
http://localhost:3000
```

---

### 4. Setup Frontend

Create `.env` inside `frontend/`:

```
VITE_API_URL=http://localhost:3000
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔗 API Overview

### Auth

* `GET /auth/google` → Start OAuth login
* `GET /auth/google/callback` → OAuth callback
* `GET /auth/profile` → Get logged-in user
* `GET /auth/logout` → Logout

### Orders

* `POST /orders` → Create order
* `GET /orders` → Get all orders
* `GET /orders/history` → Filter order history
* `POST /orders/items` → Add item

### Payments

* `POST /payments` → Complete payment

### Tables

* `GET /tables` → Get all tables
* `PATCH /tables/:id/status` → Update status

### Analytics

* `GET /analytics` → Get analytics data

---

## 🧠 Architecture

```
Controller → Service → Prisma → Database
```

### 🔥 Core Logic

* `tableId present` → DINE_IN
* `tableId absent` → TAKEOUT
* Table auto updates on order creation
* Bill must be generated before payment
* Payment completes order and resets state

---

## 🚀 Deployment

### Frontend (Vercel)

👉 https://quickserve-21f9fn3b8-venkatm77797s-projects.vercel.app/

### Backend

* Render / Railway recommended

---

## ⚠️ Environment Variables

### Frontend (`.env`)

```
VITE_API_URL=http://localhost:3000
```

### Backend (`.env`)

```
DATABASE_URL=your_postgres_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_secret
```

---

## 📌 Future Improvements

* Online Payments (UPI / Card)
* Role-based dashboards
* Kitchen Display System (KDS)
* Real-time updates with WebSockets
* Mobile-first UI
* Inventory management

---

## 👨‍💻 Author

**Venkat**

---

## ⭐ Notes

This project demonstrates:

* Full-stack architecture
* OAuth + JWT authentication
* Real-world restaurant workflow logic
* Clean frontend-backend integration

---
