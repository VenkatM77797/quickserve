🍽️ QuickServe – Restaurant Management System

A full-stack restaurant management application built using modern web technologies. This system helps manage dine-in and takeout orders, tables, billing, and payments efficiently.

🚀 Features
🍽️ Create orders for Dine-in and Takeout
🪑 Manage table status (Available / Occupied)
🛒 Add items to cart and update quantities
🧾 Generate bill dynamically
💳 Process payments (Cash)
📋 View existing orders with items
🔄 Real-time UI updates
⚡ Fast and responsive interface
🛠️ Tech Stack
Frontend
React.js
TypeScript
HTML, CSS
Fetch API
Backend
Node.js
NestJS
Prisma
PostgreSQL
📁 Project Structure
quickserve/
│
├── backend/              # Backend (NestJS API)
│   ├── src/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── menu/
│   │   ├── tables/
│   │   ├── prisma/
│   │   └── main.ts
│   └── prisma/
│       └── schema.prisma
│
├── frontend/             # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Menu.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Bill.tsx
│   │   │   └── OrderScreen.tsx
│   │   └── App.tsx
│
└── README.md
⚙️ Installation & Setup
1. Clone the repository
git clone https://github.com/your-username/quickserve.git
cd quickserve
2. Setup Database (PostgreSQL)

Create a database:

quickserve_db

Run Prisma migrations:

cd backend
npx prisma migrate dev
3. Setup Backend
cd backend
npm install
npm run start:dev

Backend runs on:

http://localhost:3000
4. Setup Frontend
cd frontend
npm install
npm start

Frontend runs on:

http://localhost:3001
🔗 API Endpoints
Orders
POST /orders → Create order (Dine-in / Takeout)
GET /orders → Get all orders
GET /orders/table/:id → Get open order by table
POST /orders/items → Add item to order
Payments
POST /payments → Complete payment
Tables
PATCH /tables/:id/status → Update table status
Menu
GET /categories → Get menu categories
🧠 Architecture

The backend follows a clean modular structure:

Controllers → Services → Prisma → Database
🔥 Key Logic
If tableId exists → Order is DINE_IN
If tableId is absent → Order is TAKEOUT
Table status automatically updates on order creation and completion
📌 Future Improvements
User authentication (Admin / Staff)
Online payment integration (UPI / Card)
Order history dashboard
Kitchen display system (KDS)
Improved UI/UX design
👨‍💻 Author

Venkat
