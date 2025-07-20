# Kytriq Corporate Website

A full-stack web application for Kytriq, featuring e-commerce, software products, blog, and admin functionality.

## Features

- Product catalog and e-commerce functionality
- Software products showcase
- Blog with articles
- Career listings
- User authentication and authorization
- Admin dashboard for content management

## Technology Stack

- **Frontend**: React, TypeScript, React Router, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Authentication**: JWT

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd kytriq
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3001

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kytriq

# JWT Configuration
JWT_SECRET=your-secret-key-should-be-long-and-secure

# Google Gemini API Key (if used)
GEMINI_API_KEY=your-gemini-api-key
```

Replace the values with your actual configuration:
- For local MongoDB: `mongodb://localhost:27017/kytriq`
- For MongoDB Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/kytriq?retryWrites=true&w=majority`

### 4. Install ts-node (if not already installed)

```bash
npm install -D ts-node
```

### 5. Start the development server

```bash
# Start the frontend development server
npm run dev

# In a separate terminal, start the backend server
npm run server
```

The frontend will be available at http://localhost:5173 and the backend API at http://localhost:3001.

> **Note**: If you encounter any issues with the backend server not starting, make sure MongoDB is running and that you have ts-node installed.

## Database Integration

The application uses MongoDB for data persistence. The database models include:

- Products
- Software Products
- Blog Posts
- Job Openings
- Users
- Orders

When the server starts for the first time, it will automatically seed the database with initial data if the collections are empty.

### Security Features

The application implements several security features:

- **Password Hashing**: User passwords are securely hashed using bcrypt before being stored in the database
- **JWT Authentication**: JSON Web Tokens are used for secure authentication
- **Role-Based Access Control**: Different routes are protected based on user roles
- **Secure Password Comparison**: Password verification is done securely using bcrypt's compare function

## API Endpoints

The backend provides the following API endpoints:

- `/api/products` - Product management
- `/api/software` - Software product management
- `/api/blog` - Blog post management
- `/api/careers` - Job opening management
- `/api/orders` - Order management
- `/api/users` - User management
- `/api/auth` - Authentication (login, signup, profile)

## Admin Access

To access the admin dashboard, use the following credentials:

- Email: admin@kytriq.com
- Password: password123
