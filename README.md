# Task Management Application

🚀 **Welcome to the Ultimate Task Management Application!** 🎯

This full-stack powerhouse is built with **Next.js, Redux Toolkit, NestJS, and MongoDB**—bringing you seamless task management with powerful features, a sleek UI, and robust backend performance. 💡✨

---

## 📜 Table of Contents

- [🚀 Features](#-features)
- [🔧 Prerequisites](#-prerequisites)
- [⚡ Getting Started](#-getting-started)
  - [🏃 Running the Project Locally](#-running-the-project-locally)
  - [🐳 Running with Docker Compose](#-running-with-docker-compose)
- [🧪 Running the Test Suite](#-running-the-test-suite)
- [📂 Project Structure](#-project-structure)
- [📜 License](#-license)

---

## 🚀 Features

✅ **Beautiful Responsive UI** powered by Aceternity Components ✨  
✅ **Create, Read, Update, Delete (CRUD) tasks** effortlessly 📝  
✅ **Advanced Search & Filtering** by title or status 🔍  
✅ **Paginated Task List** for optimal performance 📜  
✅ **Redux Toolkit for State Management** 🧠  
✅ **NestJS & MongoDB Backend** for seamless data handling 🔗  
✅ **Form Validation & Error Handling** 🚨  
✅ **Docker-ready for Easy Deployment** 🐳  

---

## 🔧 Prerequisites

Before diving in, make sure you have these installed:

🔹 [Node.js](https://nodejs.org/) (v18+)
🔹 [npm](https://www.npmjs.com/) (v7+)
🔹 [Docker](https://www.docker.com/) (for containerized deployment)
🔹 [MongoDB](https://www.mongodb.com/) (for local setup)

---

## ⚡ Getting Started

### 🏃 Running the Project Locally

```bash
# Clone the repository
$ git clone https://github.com/yourusername/task-management-app.git
$ cd task-management-app
```

#### 🛠️ Backend Setup
```bash
$ cd backend
$ npm install

# Create a .env file and add:
MONGODB_URI=mongodb://localhost:27017/task-management
PORT=3001

# Start MongoDB (if running locally)
$ mongod

# Or with Docker
$ docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start the backend server
$ npm run start:dev
```

#### 🎨 Frontend Setup
```bash
$ cd ../frontend
$ npm install

# Create a .env.local file and add:
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start the frontend server
$ npm run dev
```

🔥 **Access the App:**
- **Frontend:** [http://localhost:3000](http://localhost:3000) 🖥️
- **Backend API:** [http://localhost:3001/api](http://localhost:3001/api) ⚙️

---

### 🐳 Running with Docker Compose

```bash
$ docker-compose up
```

🔥 **Access the App:**
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:3001/api](http://localhost:3001/api)

---

## 🧪 Running the Test Suite

**Backend Tests**
```bash
$ cd backend
$ npm run test
$ npm run test:cov  # Run test coverage report
```

**Frontend Tests**
```bash
$ cd ../frontend
$ npm run test
```

---

## 📂 Project Structure

```
task-management-app/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── styles/
│   ├── tests/
│   └── public/
├── backend/
│   ├── src/
│   ├── tests/
│   ├── database/
│   ├── config/
│   ├── middleware/
│   └── services/
└── docker-compose.yml
```

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and contribute! 🚀
