import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://team-task-manager-green-eta.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
