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

You can start both the frontend and backend servers concurrently with a single command:

```bash
# Start both frontend and backend servers
npm start
```

Or you can start them separately:

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

## Frontend-Backend Integration

The application features a full integration between the frontend and backend:

1. **API Services**: The frontend uses dedicated API service modules in `services/api.ts` to communicate with the backend.

2. **Context Providers**: The application uses React Context (in `contexts/ContentContext.tsx`) to manage state and handle API calls, making data available throughout the application.

3. **Authentication Flow**: User authentication is handled through JWT tokens, with the token stored in localStorage and included in API requests.

4. **Data Flow**:
   - When the application loads, it fetches data from the backend API
   - User actions (adding to cart, placing orders, etc.) trigger API calls to update the backend
   - Admin actions (creating/editing products, etc.) are persisted to the database

To verify the integration is working correctly:

1. Start both servers using `npm start`
2. Open the application in your browser
3. Verify that products, software, blog posts, etc. are displayed (these are fetched from the backend)
4. Try logging in with the admin credentials to access protected features
5. Make changes in the admin interface and verify they persist after refreshing the page

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
