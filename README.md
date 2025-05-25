# 🍄 Mushroom Classification System

This is a full-stack MERN (MongoDB, Express, React, Node.js) application that identifies and classifies mushrooms from images into one of four categories: **edible**, **conditionally edible**, **poisonous**, or **deadly**. It features a user-friendly web UI, an admin dashboard, user authentication, and feedback capabilities to improve model accuracy over time.

---

## 🧠 Core Features

- ✅ **Mushroom image classification** using TensorFlow (MobileNetV2)
- 🖼️ Upload, preview, and analyze mushroom images via an interactive frontend
- 💬 **User feedback system** for classification corrections
- 🧑‍💼 **Admin panel** with role-based access and user management
- 🔐 **JWT authentication** (register/login/logout)
- ☁️ Cloudinary integration for image hosting
- 🔁 React Query-powered API interactions with caching and loading states

---

## 🛠️ Tech Stack

### Frontend

- **React 18 + Vite**
- **Tailwind CSS** for styling
- **shadcn/ui + Radix UI** for modern components
- **React Hook Form + Zod** for form validation
- **React Query + Axios** for API handling
- **React Router DOM** for navigation
- **Recharts** for admin data visualization

### Backend

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT, bcryptjs, express-validator** for authentication and validation
- **Multer + Cloudinary** for file uploads and image hosting
- **Python** integration via `child_process` for TensorFlow predictions

### Machine Learning

- **TensorFlow (MobileNetV2)** for pre-check and classification
- Python script (`predict.py`) processes images and returns classification results

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mushroom-classifier.git
cd mushroom-classifier
```

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Environment Variables

Create a `.env` file in `server/`:

```env
PORT=3000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

### 4. Run the App

```bash
# Backend
cd server
npm run dev

# Frontend (in another terminal)
cd client
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:3000

---

## 🔄 Classification Workflow

1. User uploads an image
2. The backend sends the image to the Python script (`predict.py`)
3. The script checks if the image contains a mushroom using MobileNetV2
4. If valid, the image is classified into one of 4 classes
5. Results are saved to MongoDB and returned to the frontend
6. User can submit feedback if prediction is inaccurate

---

## 🧑‍💼 Admin Panel

- View all users, feedback, and classification stats
- Role-based access enforced via middleware (`isAdmin`)
- Charts rendered using **Recharts**
- Admin can manage accounts and flag predictions for review

---

## ✉️ Feedback System

- Users can leave feedback after classification
- Feedback is stored in the database for future analysis or model improvement
- Managed using React Context + backend APIs

---

## 🛡️ Authentication Flow

- JWT-based login/register with secure token storage
- Role-based access control for admin routes
- Tokens stored in localStorage and validated on each request
- Automatic logout on token expiration or invalidation

---

## 🤖 Machine Learning Model

- **Base**: MobileNetV2 with transfer learning
- **Classes**: `edible`, `conditionally_edible`, `poisonous`, `deadly`
- **Format**: `.h5` saved TensorFlow model
- **Execution**: Invoked by Node.js via `spawn('python', [...])`

---

## ⚠️ Disclaimer

> **Do not consume wild mushrooms** based solely on AI results.  
> This app is for educational and research purposes only.

---

## 📌 Future Enhancements

- 🌍 Internationalization (i18n) support
- 📱 Mobile PWA support
- 🧠 Active learning using feedback loop
- 📤 Export results and history
- 🕵️ Admin moderation of user-submitted images

---

## 🙋‍♂️ Author

**Harshana Batagalla**  
Undergraduate - University of Moratuwa, Faculty of IT  
🔗 [LinkedIn](https://www.linkedin.com/in/harshana-batagalla/) | 🌐 [Portfolio](https://harshanabatagalla.github.io/)

---
