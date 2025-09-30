# WalkUp E-commerce Application

A full-stack MERN (MongoDB, Express.js, React, Node.js) e-commerce application with admin panel, user authentication, shopping cart, and payment integration.

## Features

- 🛍️ **E-commerce Platform**: Product catalog, shopping cart, checkout
- 👤 **Advanced Authentication**: Register, login, logout with JWT
- 🔐 **Password Recovery**: Forgot password and reset functionality
- 📧 **Email Integration**: Welcome emails and password reset emails
- 🛒 **Shopping Cart**: Add/remove items, quantity management
- 💳 **Payment Integration**: PayPal payment processing
- 📱 **Admin Panel**: Product management, order tracking
- 🔍 **Search & Filter**: Advanced product search and filtering
- 📍 **Address Management**: Multiple shipping addresses
- ⭐ **Reviews & Ratings**: Product reviews and star ratings
- 🖼️ **Image Upload**: Cloudinary integration for product images
- 🎨 **Modern UI**: Professional, responsive design with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with Vite
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Radix UI components
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Cookie-parser for session management
- CORS for cross-origin requests
- Multer for file uploads
- PayPal SDK for payments
- Cloudinary for image storage
- Nodemailer for email functionality
- Crypto for secure token generation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager
- Email service account (Gmail recommended for development)


### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/check-auth` - Check authentication status

### Products
- `GET /api/shop/products/get` - Get all products with filters
- `GET /api/shop/products/get/:id` - Get product details
- `POST /api/admin/products/add` - Add new product (admin)
- `PUT /api/admin/products/update/:id` - Update product (admin)
- `DELETE /api/admin/products/delete/:id` - Delete product (admin)

### Cart
- `GET /api/shop/cart/get` - Get user cart
- `POST /api/shop/cart/add` - Add item to cart
- `PUT /api/shop/cart/update` - Update cart item
- `DELETE /api/shop/cart/delete/:id` - Remove item from cart

### Orders
- `GET /api/shop/order/get` - Get user orders
- `POST /api/shop/order/add` - Create new order
- `GET /api/admin/orders/get` - Get all orders (admin)

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
ec-MERN/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   └── config/        # Configuration files
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── helpers/          # Utility functions
│   └── server.js         # Main server file
└── README.md
```