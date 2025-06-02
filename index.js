// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.route.js';
import taskRoutes from './src/routes/task.route.js';
import subBoardRoutes from './src/routes/subboard.route.js';
import commentRoutes from './src/routes/comment.route.js';
import teamRoutes from './src/routes/team.route.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Sample route
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/', subBoardRoutes);
app.use('/api/', commentRoutes);
app.use('/api/teams', teamRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
