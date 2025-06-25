import mongoose, { Document, Schema } from 'mongoose';

export interface TestOption {
  text: string;
  isCorrect: boolean;
}

export interface Test extends Document {
  question: string;
  options: TestOption[];
  createdAt: Date;
}

const TestOptionSchema = new Schema<TestOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
}, { _id: false });

const TestSchema = new Schema<Test>({
  question: { type: String, required: true },
  options: { type: [TestOptionSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

export const TestModel = mongoose.model<Test>('Test', TestSchema); 