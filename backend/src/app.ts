import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import blogRouter from './routes/blog.routes';
import testRouter from './routes/test.routes';
import mongoose from 'mongoose';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '150mb' }));
app.use(express.json({ limit: '150mb' }));
app.use('/uploads', express.static('uploads'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/estetik-tarbiya';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err: any) => console.error('MongoDB connection error:', err));

app.use('/api/blogs', blogRouter);
app.use('/api/tests', testRouter);

export default app;
