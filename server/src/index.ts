import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import {errorHandler} from './middleware/errorHandler';
//env file
dotenv.config();

//initialize express and port
const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



//health check endpoint
app.get('/api/health', (req,res) => {
    res.json({message: 'Server is healthy', timestamp: new Date().toISOString() });
})
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
//error handler
app.use(errorHandler);

//mongodb connection
mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT ,() => {
            console.log(`Server listening on port ${PORT}`);
        });
      })
      .catch((error: any) => {
        console.error('Error in MongoDBV connection',error);
      });
      
