
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './db/connection';
import { initializeDatabase } from './db/data';

// Import routes
import productRoutes from './routes/products';
import softwareRoutes from './routes/software';
import blogRoutes from './routes/blog';
import careerRoutes from './routes/careers';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import geminiRoutes from './routes/gemini';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/gemini', geminiRoutes);

app.get('/api', (req, res) => {
  res.send('Kytriq Backend is running!');
});

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Initialize database with seed data if needed
    await initializeDatabase();

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
