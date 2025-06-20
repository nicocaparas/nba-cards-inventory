# 🏀 NBA Card Inventory Management System

A full-stack web application to manage, track, and monitor your NBA trading card collection.

## 🚀 Features
- Add new cards with player name, year, brand, variant, grading info, and price.
- Edit and delete cards in your collection.
- View cards in a clean, searchable table layout.
- Hot Cards section featuring top-performing cards.
- Built with React (Frontend) and Node.js/Express + Prisma (Backend).
- Integrate real-time pricing updates via the eBay API. ♻️ **IN PROGRESS** ♻️

## 🛠️ Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL (via Prisma ORM)
- API Integration: Planned eBay API

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd nba-card-inventory
```
### 2. Install Backend Dependencies
```bash
cd backend
npm install
npm run dev
```
### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
npm start
```

## 🔮 Future Improvements
- Live market value updates via eBay API ♻️ **IN PROGRESS** ♻️
- Sorting and advanced filtering
- Card images and more metadata
- Deployment to Vercel

## 🚧 eBay API Integration Status
**📅 Status: Actively in development (as of June 13, 2025)**  
- 🔍 This app originally intended to use eBay’s Finding API (findCompletedItems) to track sold card prices, but the API is deprecated.
- 🔄 I'm now working toward integrating the Marketplace Insights API, which provides sales history data.
- 🛠️ Integration requires passing eBay’s Application Growth Check, so the process involves multiple compliance and development steps.

## 📄 License
This project is licensed under the MIT License.



