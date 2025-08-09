# 📊 Portfolio Analytics Dashboard

An **interactive portfolio analytics dashboard** with a backend in **Express.js** and frontend in **React + Tailwind CSS**.  
It provides a complete view of portfolio performance, asset allocation, and stock-specific insights through a clean, responsive UI.  

---

## 🚀 Features

### **Frontend**
- **Portfolio Overview Cards** – Displays total portfolio value, total gain/loss, performance %, and holdings count.  
- **Asset Allocation Charts** –  
  - **Sector Distribution** (Donut chart)  
  - **Market Cap Distribution** (Pie chart)  
- **Holdings Table** – Sortable, filterable, and color-coded performance data.  
- **Performance Comparison** – Portfolio vs Nifty 50 vs Gold over time.  
- **Top Performers Section** – Best and worst performing stocks with diversification and risk insights.  
- **Responsive Design** – Optimized for desktop and mobile.  

### **Backend**
- REST API built with **Express.js**.  
- Calculates portfolio performance, gains/losses, diversification score, and sector/market cap distribution.  
- Endpoints return pre-formatted data ready for frontend rendering.

---

## 🗂 Project Structure

### **Backend**
Located in the `backend` folder. Contains:
- **Routes** – API endpoints for portfolio data.  
- **Controllers** – Business logic for calculations.  
- **Data** – Mock or database integration.

### **Frontend**
Located in the `frontend` folder. Key folders:
```
src/
├── assets/ # Static images/icons
├── components/
│ ├── cards/ # Overview cards
│ ├── charts/ # Chart components
│ ├── common/ # Loader & error handling
│ └── portfolio/ # Portfolio-specific UI sections
├── services/ # API calls (Axios)
```


**Note:** `.env` file is included in the repo as it contains **no sensitive information**.

---

## ⚙️ Installation & Setup

### **1️ Backend Setup**
```bash
cd backend
npm install
npm start
```
This starts the backend server on the configured port.

### **2 Frontend Setup**
```bash
cd frontend
cd portfolio-analystics-dashboard
npm install
npm run dev
```

## 📡 API Endpoints (Backend)

| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| GET    | `/api/portfolio/summary`    | Returns total portfolio value, invested amount, gain/loss, top performer, worst performer, diversification score, and risk level. |
| GET    | `/api/portfolio/holdings`   | Returns a detailed list of portfolio holdings with stock-wise performance data. |
| GET    | `/api/portfolio/allocations` | Returns asset allocation data split by sector and market cap. |
| GET    | `/api/portfolio/performance` | Returns the top and worst perfomer along with the diversification score and risk level. |
| GET    | `/api/portfolio/overview` | Returns the total portfolio value, total holdings, and other things in it. |

---

## 🛠 Tech Stack

**Frontend**
- React
- Tailwind CSS
- Axios
- Recharts

**Backend**
- Node.js
- Express.js

**Development Tools**
- Vite
- npm

---

## 📌 Notes
- `.env` file is included in the repo since it contains **no sensitive information**.  
- Codebase follows a **modular and reusable component structure** to ensure maintainability.  
- Fully **responsive** design, optimized for both mobile and desktop.  
- Charts and tables are **interactive** with hover effects, tooltips, and sorting.  
- Designed to meet **internship-ready** standards with proper folder structure and clean code practices.


