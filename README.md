# MERN Stack Task Management Application

## Project Overview

A full-stack Task Management Web Application built using the MERN Stack:

* MongoDB
* Express.js
* React.js
* Node.js

The application allows users to:

* Register and Login securely using JWT Authentication
* Create, Update, Delete, and View Tasks
* Mark tasks as Pending or Completed
* Role based login like user, admin
* Search and Filter Tasks
* Access protected routes securely
* Use a responsive and modern dashboard UI

---

# Live Project

Live URL - https://primetrade-backend-assignment-sjou.onrender.com/

---

# GitHub Repository

```bash
https://github.com/neelgujarathi/primetrade-backend-assignment
```

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Bootstrap 5
* Axios

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* MongoDB + Mongoose

## Deployment

* Render

---

# Features Implemented

## Authentication

* User Registration
* User Login
* JWT Token Authentication
* Role based login
* Protected Routes
* Logout Functionality

## Task Management

* Create Tasks
* Edit Tasks
* Delete Tasks
* View Tasks
* Mark Tasks as Completed
* Mark Tasks as Pending

## Advanced Features

* Search Tasks
* Filter Tasks
* Responsive Dashboard
* Role Based Access
* Admin Dashboard

---

# Folder Structure

## Frontend Structure

```bash
frontend/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   └── App.jsx
│
├── package.json
└── vite.config.js
```

## Backend Structure

```bash
backend/
│
├── controllers/
├── middleware/
├── models/
├── routes/
├── config/
├── utils/
├── server.js
└── package.json
```

---

# Installation & Setup Instructions

## Step 1: Clone Repository

```bash
git clone https://github.com/neelgujarathi/primetrade-backend-assignment
```

---

# Backend Setup

## Step 2: Navigate to Backend Folder

```bash
cd backend
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Create .env File

Create a `.env` file inside backend folder.

Add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Example:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=mysecretkey123
NODE_ENV=development
```

---

## Step 5: Start Backend Server

### Development Mode

```bash
npm run dev
```

OR

```bash
nodemon server.js
```

### Production Mode

```bash
npm start
```

---

# Frontend Setup

## Step 6: Navigate to Frontend Folder

```bash
cd frontend
```

## Step 7: Install Dependencies

```bash
npm install
```
---

## Step 8: Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# API Endpoints

## Authentication Routes

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

---

## Task Routes

### Get All Tasks

```http
GET /api/tasks
```

### Create Task

```http
POST /api/tasks
```

### Update Task

```http
PUT /api/tasks/:id
```

### Delete Task

```http
DELETE /api/tasks/:id
```

---

# Database Schemas

## User Schema

```js
{
  name: String,
  email: String,
  password: String,
  role: String
}
```

## Task Schema

```js
{
  title: String,
  description: String,
  status: String,
  createdBy: ObjectId
}
```

---

# Authentication Flow

1. User registers account
2. Password gets hashed using bcryptjs
3. JWT token generated after login
4. Token stored in localStorage
5. Protected APIs accessed using Authorization headers

---

# Demo Credentials

## Admin Account

```bash
Email: p34@gmail.com
Password: prajwal
```

## User Account

```bash
Email: tejal25@gmail.com
Password: tejal25
```

Note:
If credentials are not available in database, create them manually using registration page or MongoDB.

---

# Search & Filter Features

The dashboard includes:

* Search tasks by title
* Search tasks by description
* Filter by:

  * All Tasks
  * Pending Tasks
  * Completed Tasks

---

# Deployment Details

## Frontend Deployment

Frontend deployed using Render Static Site.

## Backend Deployment

Backend deployed using Render Web Service.

## Database

MongoDB Atlas Cloud Database used.

---

# Security Features

* JWT Authentication
* Password Hashing using bcryptjs
* Protected API Routes
* User Authorization Validation
* Environment Variables for Secrets
```

---

# Future Improvements

* Pagination
* Dark Mode
* Due Dates
* Drag & Drop Tasks
* Notifications
* Task Priority Levels
* Email Verification

---

# Commands Summary

## Backend

```bash
npm install
npm run dev
```

## Frontend

```bash
npm install
npm run dev
```

---

# Author

Neel Gujarathi

Full Stack Web Developer

---

# Conclusion

This project demonstrates:

* MERN Stack Development
* REST API Development
* Authentication & Authorization
* Frontend + Backend Integration
* Database Management
* Deployment & Production Setup
* Clean UI/UX Implementation

Thank you for reviewing this assignment.
