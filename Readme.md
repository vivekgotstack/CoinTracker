<div align="center">

# 💰 CoinTracker

### Full-Stack Personal Finance Tracker

Track income, expenses, and financial activity through a secure and simple dashboard.

</div>

---

<div align="center">

## 🚀 Features

JWT-based authentication  
Income and expense tracking  
User-specific transaction data  
Dashboard for financial overview  
Date-based filtering  
Profile and preference management  
REST API backend  
Vercel-ready frontend  
Docker-ready backend  

</div>

---

<div align="center">

## 🧱 Tech Stack

### Frontend

React  
TypeScript  
Vite  
Ant Design  
Tailwind CSS  

### Backend

Java 21  
Spring Boot  
Spring Security  
Spring Data JPA  
PostgreSQL  
Maven  
Docker  

### Deployment

Vercel  
Render  
PostgreSQL Cloud Database  

</div>

---

<div align="center">

## 🏗️ Project Structure

</div>

```txt
CoinTracker/
├── cointracker-backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── cointracker-frontend/
│   ├── src/
│   ├── package.json
│   └── vercel.json
│
└── README.md
```

---

<div align="center">

## 🧪 Run Locally

### Backend

</div>

```bash
cd cointracker-backend
mvn spring-boot:run
```

<div align="center">

Backend runs on:

</div>

```txt
http://localhost:8080
```

<div align="center">

### Frontend

</div>

```bash
cd cointracker-frontend
npm install
npm run dev
```

<div align="center">

Frontend runs on:

</div>

```txt
http://localhost:5173
```

---

<div align="center">

## 🐳 Docker

</div>

```bash
cd cointracker-backend
docker build -t cointracker-backend .
docker run -p 8080:8080 cointracker-backend
```

---

<div align="center">

## 📦 API Routes

</div>

```txt
POST   /auth/register
POST   /auth/login

GET    /transactions
POST   /transactions
PUT    /transactions/{id}
DELETE /transactions/{id}

GET    /user/profile
```

---

<div align="center">

## ▲ Vercel Setup

For React Router refresh support, add this file:

`cointracker-frontend/vercel.json`

</div>

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

<div align="center">

Recommended Vercel settings:

</div>

```txt
Framework Preset: Vite
Root Directory: cointracker-frontend
Build Command: npm run build
Output Directory: dist
```

---

<div align="center">

## 🔥 Status

Active Development

</div>

---

<div align="center">

## 👨‍💻 Author

**Vivek**

</div>
