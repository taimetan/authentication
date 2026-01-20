# 🔐 MERN Stack Authentication System

Dự án này là một **hệ thống xác thực người dùng** được xây dựng bằng **MERN Stack (MongoDB, Express, React, Node.js)**, tập trung vào các chức năng xác thực phổ biến và thực tế trong ứng dụng web.

---

## 🚀 Tính năng chính

* ✅ Đăng ký tài khoản người dùng
* 📧 Xác thực **OTP qua Email** khi đăng ký
* 🔑 Đăng nhập người dùng
* 🔒 Đăng xuất
* ❓ Quên mật khẩu
* 🔁 Reset mật khẩu qua Email (token)
* 🔐 Bảo mật mật khẩu bằng hashing
* 🍪 Xác thực bằng JWT (Access Token / Refresh Token nếu có)

---

## 🛠 Công nghệ sử dụng

### Backend

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (JSON Web Token)**
* **Bcrypt** (hash mật khẩu)
* **Nodemailer** (gửi email OTP & reset mật khẩu)

### Frontend

* **React.js**
* **React Router DOM**
* **Axios**
* **State Management (Context / Zustand / Redux tuỳ chọn)**
* **React Hot Toast** (hiển thị thông báo)

---

## 📂 Cấu trúc thư mục

```
root
├── backend
│   ├── controllers
│   ├── db
│   ├── mail
│   ├── models
│   ├── routes
│   ├── middlewares
│   ├── utils
│   ├── config
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── libs
│   │   ├── stores
│   │   ├── utils
│   │   └── App.jsx
│   └── main.jsx
│
└── README.md
```

---

## 🔄 Luồng hoạt động chính

### 1️⃣ Đăng ký & Xác thực OTP

1. Người dùng đăng ký tài khoản
2. Backend gửi **OTP qua Email**
3. Người dùng nhập OTP để xác thực
4. Tài khoản được kích hoạt

### 2️⃣ Đăng nhập

* Kiểm tra email & mật khẩu
* Trả về JWT nếu thành công

### 3️⃣ Quên mật khẩu

1. Người dùng nhập email
2. Hệ thống gửi link reset mật khẩu qua email
3. Link chứa **reset token**

### 4️⃣ Reset mật khẩu

* Người dùng đặt mật khẩu mới
* Token được xác thực & vô hiệu hoá sau khi dùng

---

## ⚙️ Cài đặt & Chạy dự án

### 1️⃣ Clone repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=localhost
```

Chạy backend:

```bash
npm run dev
```

### 3️⃣ Cài đặt Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Bảo mật

* Mật khẩu được **hash bằng bcrypt**
* OTP & token reset có **thời gian hết hạn**
* Không lưu mật khẩu dạng plain text
* Token được xác thực ở middleware

---

## 📌 Hướng phát triển

* [ ] Refresh Token
* [ ] Xác thực Google / Facebook
* [ ] Phân quyền người dùng (Role-based)
* [ ] Rate limiting & chống brute force

---

## 👨‍💻 Tác giả

* **Play MC**
* MERN Stack Developer

---

⭐ Nếu bạn thấy project này hữu ích, hãy cho một star nhé!
