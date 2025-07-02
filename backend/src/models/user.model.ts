import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  solvedTests: { test: mongoose.Types.ObjectId; isCorrect: boolean }[];
  points: number;
  rank: number;
  solvedQuizPacks: string[];
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  solvedTests: [{
    test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    isCorrect: { type: Boolean, required: true }
  }],
  points: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  solvedQuizPacks: [{ type: String, default: [] }],
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  avatar: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema); 