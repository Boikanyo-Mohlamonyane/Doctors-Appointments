# 🏥 Medical Appointment System – Frontend

This is the frontend of the **Medical Appointment Management System**, built using React.
It allows users, doctors, and admins to interact with the system for booking, managing, and tracking medical appointments.

---

## 🚀 Features

* 🔐 User Authentication (Login & Register)
* 👨‍⚕️ View Available Doctors
* 📅 Book Appointments
* 📊 Dashboard for Users, Doctors, and Admins
* 🔄 Appointment Rescheduling & Cancellation
* 📆 Calendar View (FullCalendar Integration)
* 🔒 JWT-based secure API communication

---

## 🛠️ Tech Stack

* React (Create React App)
* Axios (API communication)
* Tailwind CSS (UI styling)
* FullCalendar (Scheduling UI)
* JWT Authentication

---

## 🌐 Backend API

This frontend connects to the Spring Boot backend:

```
http://63.33.171.154:8080/api
```

Make sure your backend is running and CORS is properly configured.

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```
REACT_APP_API_URL=http://63.33.171.154:8080/api
```

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/medical-frontend.git
cd medical-frontend
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Running the App

```bash
npm start
```

App will run at:

```
http://localhost:3000
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Build files will be generated in:

```
/build
```

---

## 🚀 Deployment

This project is deployed using:

* Docker (containerized frontend)
* GitHub (version control)
* EC2 Server (hosting)

---

## 🔐 Authentication Flow

1. User logs in via `/auth/login`
2. Backend returns JWT token
3. Token is stored in `localStorage`
4. Axios automatically attaches token to requests

---

## 📁 Project Structure

```
src/
 ├── components/
 ├── pages/
 ├── services/
 ├── utils/
 └── App.js
```

---

## ⚠️ Known Issues

* CORS errors may occur if backend is misconfigured
* Ensure correct API URL in `.env`
* Backend must allow:

  ```
  http://63.33.171.154:3000
  ```

---

## 📚 Learn More

* React Docs: https://reactjs.org/
* Axios Docs: https://axios-http.com/
* FullCalendar: https://fullcalendar.io/

---

## 👨‍💻 Author

Developed as part of a full-stack project integrating React + Spring Boot + Docker.

---
