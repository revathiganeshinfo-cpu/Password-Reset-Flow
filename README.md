# 🔐 Password Reset Flow — Backend

A secure Node.js + Express REST API implementing a complete password reset flow with email verification, token expiry, and password hashing.

## 🚀 Tech Stack

- **Node.js** — Runtime environment
- **Express** — Web framework
- **MongoDB + Mongoose** — Database & ODM
- **Nodemailer** — Sending reset emails via Gmail SMTP
- **bcryptjs** — Password hashing
- **crypto** — Secure random token generation
- **dotenv** — Environment variable management
- **cors** — Cross-origin resource sharing

## 📋 Features

- User registration with strong password validation
- Login with hashed password comparison
- Forgot password — generates a secure random token and emails a reset link
- Token stored in DB with expiry (default: 15 minutes)
- Reset password — validates token, expiry, and updates password securely
- Token is cleared from DB after successful reset (prevents reuse)
- Proper error handling for invalid/expired tokens
