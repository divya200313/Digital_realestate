# 🏠 EstateVista — Real Estate Platform

A modern full-stack real estate listing application built with React, Node.js, and MongoDB.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB Atlas** or local MongoDB.
- **Cloudinary Account** (for image storage).

### 2. Configuration
Create/Update your `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Backend
Open a new terminal and run:
```powershell
cd backend
npm install
npm run dev
```
The server will run at [**http://localhost:5000**](http://localhost:5000).

### 4. Run the Frontend
In another terminal, from the **root** folder, run:
```powershell
npm install
npm run dev
```
The application will be available at [**http://localhost:5173**](http://localhost:5173).

### 5. Seed Initial Data (Optional)
To quickly populate the app with luxury listings:
```powershell
cd backend
npm run seed
```
- **Username**: `seller@example.com`
- **Password**: `password123`

### 6. Clear Data (Optional)
To wipe all users and properties from the database:
```powershell
cd backend
npm run clear
```


---

## 🏗️ Tech Stack
- **Frontend**: React.js, Tailwind CSS v4, React Router, Axios.
- **Backend**: Node.js, Express, Mongoose.
- **Auth**: JWT (JSON Web Tokens) + Bcrypt.
- **Media**: Cloudinary (Image handling with Multer).

---

## ✨ Features
- **User Auth**: Secured role-based access (Buyer/Seller).
- **Listing Search**: Filter by location, price, property type, and amenities.
- **Property Management**: Sellers can create, edit, and delete their own listings.
- **Responsive Design**: Mobile-friendly, high-performance UI.
