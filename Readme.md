<div align="center">

# 💰 CoinTracker

### A Modern Personal Money Management System

Track income, expenses, and financial activity in one place with clarity and control.

---

</div>

---

<div align="center">

## ⚡ Overview

CoinTracker helps users manage personal finances efficiently.

- Track income and expenses  
- Monitor financial history  
- Analyze spending patterns  
- Maintain financial discipline  

</div>

---

## 🧱 Tech Stack

### Backend
- Java 21  
- Spring Boot  
- Spring Security (JWT)  
- Spring Data JPA  
- PostgreSQL  
- Maven  

### Frontend
- React  
- TypeScript  
- Vite   

### DevOps
- Docker  
- Render deployment ready  

---

## 🚀 Features

- 🔐 Secure authentication (JWT)
- 💸 Income & expense tracking
- 📊 Financial insights
- 📅 Date-based filtering
- 👤 User-specific data isolation
- ⚡ Fast REST APIs

---

## 🏗️ Project Structure

CoinTracker/

- cointracker-backend/
  - src/
  - pom.xml
  - Dockerfile

- cointracker-frontend/
  - src/
  - package.json

- README.md


## ⚙️ Environment Variables (Backend)

ACTIVE_PROFILE=prod

DB_URL=your_database_url
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DRIVER_NAME=org.postgresql.Driver

SECRET_KEY=your_jwt_secret

BREVO_USERNAME=your_email_user
BREVO_PASSWORD=your_email_pass
BREVO_EMAIL=your_sender_email

BASE_URL=your_backend_url
FRONTEND_URL=your_frontend_url

---

## 🐳 Run with Docker

docker build -t cointracker-backend . <br/>
docker run -p 8080:8080 cointracker-backend


---

## 📦 API Endpoints

- `/auth/register`
- `/auth/login`
- `/transactions`
- `/transactions/{id}`
- `/user/profile`

---

## 📌 Goal of This Project

- Build real-world full-stack system  
- Practice production-grade backend design  
- Learn deployment (Render + Docker)  
- Improve system design fundamentals  

---

<div align="center">

## 🔥 Status

🚧 Active Development  
⚙️ Backend Stable  
🎨 Frontend Evolving  

---

## 👨‍💻 Author

**Vivek**

</div>