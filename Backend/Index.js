import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRouter from './Route/AdminRoute.js';
import UserRoute from './Route/UserRoute.js';
import SellerRouter from './Route/SellerRoute.js';
import databaseConnection from './Utils/Db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

databaseConnection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

const allowedOrigins = [
  'http://localhost:5173',                      
  'https://flybuybrand.com',
  'https://www.flybuybrand.com',
  'https://fbb-store-e-commerce.vercel.app',     
  'https://your-frontend.vercel.app'           
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'device-id'],
  credentials: true
}));

app.use('/api/admin', adminRouter);
app.use('/api/', UserRoute);
app.use('/api/seller', SellerRouter);

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
