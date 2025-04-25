
# 🦷 Dentist Appointment Booking Platform

A fully developed and feature-rich appointment booking platform designed specifically for dental clinics. It allows patients to easily book appointments with dentists, manage their profiles, and receive real-time notifications. The platform also provides an Doctor panel for managing users, appointments, and clinic schedules.

## 🔗 LIVE LINK: [https://dentist-booking-liart.vercel.app/](https://dentist-booking-liart.vercel.app/)

---

## 🧪 Credentials
### 👨‍⚕️ Doctor  :- 
Can be created at :->  https://dentist-booking-liart.vercel.app/signup/doctor
### 👨‍⚕️ Doctor(Demo):
- **Email**: muralikrishna8309@gmail.com
- **Password**: murali@24

### 👤 User:
- **Create your own account**, or  
- **Demo Email**: demo@gmail.com  
- **Password**: demo@24

---

## ✨ Features

- **User Authentication**: Register and log in with OTP verification through email for secure access.
- **Appointment Booking**: Book dental appointments with available doctors at your preferred time.
- **Profile Management**: Update your personal details, appointment history, and upcoming bookings.
- **Email Notifications**: Get emails for booking confirmations, cancellations, and reminders.
- **In-App Notifications**: Receive real-time updates about your appointments inside the app.
- **Admin Panel**: Admins can manage all users, appointments, dentists, and view system analytics.
- **Responsive UI**: Fully optimized for both desktop and mobile experiences.
- **Secure Backend**: Built using scalable architecture and secured via JWT-based authentication.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT + OTP (via email)
- **Notifications**: Nodemailer for emails, in-app notification system
- **Admin Panel**: Custom dashboard with role-based access

---

## 🚀 Setup Instructions

### 📦 Prerequisites
- Node.js (v14 or above)
- NPM
- MongoDB
- Git

---

### 📁 Clone the Repository

```bash
git clone https://github.com/your-username/Dental-Booking.git
cd Dental-Booking
```

---

### 🔧 Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

---

### 📑 Setup Environment Variables

Create a `.env` file in both `backend` and `frontend` folders.

**Example for `.env` in backend:**
```env
PORT=5000
DENTAL=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/dentalDB
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```


**Example for `.env` in frontend:**
```env
REACT_APP_BACKEND_URL=http://localhost:5000

```

---

### ▶️ Run the Project

#### Backend:
```bash
cd backend
npm start
```

#### Frontend:
```bash
cd frontend
npm start
```

---

### 🌐 Access the Application

Once both frontend and backend are running:

**Frontend:** [http://localhost:3000](http://localhost:3000)  
**Backend API:** [http://localhost:5000](http://localhost:5000)

---

## 🛡️ Doctor Panel

Doctor can:
- View all registered users
- Approve or cancel appointments
- Add or remove dentists and manage their availability
- Monitor system analytics and performance

---

## 🔐 Email OTP Authentication

- Users receive an OTP via email during registration or login
- This ensures secure access to the system and prevents unauthorized usage

---

## 🔔 Notifications

- **Email Alerts** for appointment status, updates, and promotions
- **In-App Notifications** for real-time appointment updates and reminders

---

## 🤝 Contributing

We welcome contributions from the community!

1. Fork the repository  
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -am "Add new feature"
   ```
4. Push to GitHub:
   ```bash
   git push origin feature-name
   ```
5. Create a Pull Request

---

## 📩 Contact

For any issues, suggestions, or contributions, feel free to reach out:  
**Email:** muralikrishna8309@gmail.com

---
