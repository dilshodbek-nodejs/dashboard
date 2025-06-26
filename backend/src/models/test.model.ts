import mongoose, { Document, Schema, Types } from 'mongoose';

export interface TestOption {
  text: string;
  isCorrect: boolean;
}

export interface Test extends Document {
  question: string;
  options: TestOption[];
  createdAt: Date;
  topic?: Types.ObjectId;
}

export interface TestTopic extends Document {
  title: string;
  description: string;
  createdAt: Date;
}

const TestOptionSchema = new Schema<TestOption>({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true }
}, { _id: false });

const TestSchema = new Schema<Test>({
  question: { type: String, required: true },
  options: { type: [TestOptionSchema], required: true },
  createdAt: { type: Date, default: Date.now },
  topic: { type: Schema.Types.ObjectId, ref: 'TestTopic', required: false }
});

const TestTopicSchema = new Schema<TestTopic>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const TestModel = mongoose.model<Test>('Test', TestSchema);
export const TestTopicModel = mongoose.model<TestTopic>('TestTopic', TestTopicSchema); 