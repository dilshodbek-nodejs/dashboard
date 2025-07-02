import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import blogRouter from './routes/blog.routes';
import testRouter from './routes/test.routes';
import authRouter from './routes/auth.routes';
import profileRouter from './routes/profile.routes';
import mongoose from 'mongoose';
import path from 'path';

const app = express();

app.use(cors({ "origin": "*" }));
app.use(bodyParser.json({ limit: '150mb' }));
app.use(express.json({ limit: '150mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/estetik-tarbiya';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err: any) => console.error('MongoDB connection error:', err));

app.use('/api/blogs', blogRouter);
app.use('/api/tests', testRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);

export default app;
