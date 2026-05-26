# DoubtHub AI

<div align="center">



**Your AI-Powered Coding Companion**

[![Live Demo](https://img.shields.io/badge/Live_Demo-FF5722?style=for-the-badge&logo=vercel&logoColor=white)](https://doubt-hub-ai.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-00C853?style=for-the-badge&logo=render&logoColor=white)](https://doubthub-ai-backend.onrender.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

</div>

## Table of Contents
- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About The Project

**DoubtHub AI** is a modern, AI-powered coding doubt resolution platform designed for developers and students. It combines community-driven Q&A with an intelligent AI assistant to provide instant coding solutions, debugging help, and programming guidance.

### Why DoubtHub AI?
- Instant AI Responses - Get coding solutions in milliseconds
- Community Support - Multiple developers can answer and help
- Visual Debugging - Upload screenshots of errors
- Focused Learning - Tag-based organization for better discovery

## Features

### Core Features
- AI Coding Assistant - Chat with AI to solve coding problems
- Ask Doubts - Post coding questions with detailed descriptions
- Screenshot Upload - Share error screenshots via Cloudinary
- JWT Authentication - Secure user authentication
- User Dashboard - Track your doubts and activities
- Doubt History - View all your past questions
- Doubt Solver - Community members can answer doubts
- Tag System - Organize doubts by technology/topic
- Responsive Design - Fully responsive for all devices

### User Features
- Register/Login with validation
- Profile picture upload
- Edit profile information
- Reset password functionality
- View doubt history with answers
- Mark doubts as resolved
- AI chat for instant help

### Community Features
- Any user can answer doubts
- Answer tracking with user attribution
- Resolved status management
- Answer counts and statistics

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Axios | API Calls |
| React Router DOM | Routing |
| React Hot Toast | Notifications |
| React Icons | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Cloudinary | Image Storage |
| Multer | File Upload |

## Live Demo

| Environment | URL | Status |
|-------------|-----|--------|
| Frontend | [https://doubt-hub-ai.vercel.app](https://doubt-hub-ai.vercel.app) | Live |
| Backend API | [https://doubthub-ai-backend.onrender.com](https://doubthub-ai-backend.onrender.com) | Live |

### Test Credentials
Email: test@example.com
Password: test123


## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image upload)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/DoubtHub-AI.git
cd DoubtHub-AI
```
### 2. Install Backend Dependencies
```bash
git clone https://github.com/AdarshDubey-TIMSCDR023/DoubtHubAI.git
```
### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Environment Setup
## Backend (.env)
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```
### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

### 5. Run the Application
## Start Backend Server
```bash
cd server
npm run dev
```

### Start Frontend Development Server
``` bash
cd client
npm run dev
```
```bash
The application will open at http://localhost:5173
```

## Project Structure
```bash
DoubtHub-AI/
│
├── client/                          # Frontend React Application
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AskDoubt.jsx
│   │   │   ├── AIChat.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── DoubtHistory.jsx
│   │   │   └── DoubtSolver.jsx
│   │   ├── services/               # API services
│   │   │   └── api.js
│   │   ├── App.jsx                 # Main App component
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── public/                      # Static assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Backend Node.js Application
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── doubtController.js
│   │   └── uploadController.js
│   ├── middleware/                  # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/                      # Database models
│   │   ├── User.js
│   │   └── Doubt.js
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── doubtRoutes.js
│   │   └── uploadRoutes.js
│   ├── config/                      # Configuration
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── server.js                    # Entry point
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```
# DoubtHub-AI API Documentation

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/reset-password` | Reset password |

### Doubt Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doubts` | Get all doubts |
| POST | `/api/doubts` | Create new doubt |
| GET | `/api/doubts/:id` | Get single doubt |
| PUT | `/api/doubts/:id` | Update doubt |
| DELETE | `/api/doubts/:id` | Delete doubt |

### Upload Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload image to Cloudinary |

### AI Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | AI chat interaction |

## Environment Variables

### Backend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (default: 5000) | No |
| MONGO_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Yes |
| CLOUDINARY_API_KEY | Cloudinary API key | Yes |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Yes |
| NODE_ENV | Environment (development/production) | No |

### Frontend Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |

## Deployment

### Deploy Frontend to Vercel

```bash
cd client
npm run build
vercel --prod
```


