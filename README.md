# 🛒 Full Stack E-Commerce (React + Django REST Framework)

A full-stack e-commerce web application built with **React (frontend)** and **Django REST Framework (backend)**.  
It supports authentication (JWT), product management, user & order handling, and email invoice generation.

---

## 🚀 Features

### 🖥️ Frontend (React)

- User authentication with JWT (login/register/logout)
- Product listing & detail pages
- Cart management
- Checkout flow (order creation)
- Admin dashboard (products, orders, users)
- Responsive design using React + CSS

### ⚙️ Backend (Django REST Framework)

- RESTful APIs for Products, Orders, and Users
- Admin-only CRUD operations
- JWT authentication (using `SimpleJWT`)
- Invoice email (sent via console backend)
- Stock management (auto-decrement on checkout)
- Environment-based configuration via `.env`

---

## 🧱 Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Frontend   | React, React Router, Context API        |
| Backend    | Django, Django REST Framework           |
| Auth       | JWT (djangorestframework-simplejwt)     |
| Database   | SQLite (default)                        |
| Email      | Django Console Email Backend (dev mode) |
| Env Config | python-dotenv / dotenv                  |
| Deployment | Localhost (for development)             |

---

## 📂 Project Structure

```
project-root/
│
├── backend/
│   ├── manage.py
│   ├── .env
│   ├── .env.example
│   ├── store/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_NAME=react_django_estore
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@example.com
```

### Frontend (`frontend/.env`)

```
REACT_APP_API_BASE=http://127.0.0.1:8000/api/
```

---

## 🧩 API Endpoints Overview

### 🔑 Auth

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/api/register/` | Register user               |
| POST   | `/api/token/`    | Login user & get JWT tokens |

### 🛍️ Products

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/api/products/`      | List active products |
| GET    | `/api/products/<id>/` | Get product details  |

### 📦 Orders

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| POST   | `/api/orders/`    | Create new order       |
| GET    | `/api/my-orders/` | Get user order history |

### 🧑 Admin APIs

| Method | Endpoint                    | Description        |
| ------ | --------------------------- | ------------------ |
| GET    | `/api/admin/products/`      | List all products  |
| POST   | `/api/admin/products/`      | Create new product |
| PUT    | `/api/admin/products/<id>/` | Update product     |
| DELETE | `/api/admin/products/<id>/` | Delete product     |
| GET    | `/api/admin/orders/`        | View all orders    |
| GET    | `/api/admin/users/`         | Manage users       |

---

## 🧠 How to Run (Development)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate (on Windows)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📤 API Utility (React)

The frontend uses a single API utility file to manage requests:

```js
export async function apiFetch(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("access");
  const res = await fetch(`http://127.0.0.1:8000/api/${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
  return res.status === 204 ? null : res.json();
}
```

---

## 🧾 Invoice Email (Development Mode)

In development, emails print to your console using:

```python
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "noreply@example.com"
```

When an order is placed, a confirmation (invoice) email is printed to the terminal.

---

## 👩‍💻 Author

**Developed by:** Aakansha Chindarkar  
**Role:** Full Stack Developer (React + Django)  
**Experience:** 3+ years
