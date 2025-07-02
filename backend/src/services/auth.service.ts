import User, { IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (username: string, email: string, password: string) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw new Error('User already exists');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();
  return user;
};

export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Invalid credentials');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
}; 