import { Request, Response } from 'express';
import * as testService from '../services/test.service';
import User from '../models/user.model';

export async function listTests(req: Request, res: Response) {
  const tests = await testService.getAllTests();
  res.json(tests);
}

export async function getTest(req: Request, res: Response) {
  const test = await testService.getTestById(req.params.id);
  if (!test) return res.status(404).json({ message: 'Test not found' });
  res.json(test);
}

export async function createTestHandler(req: Request, res: Response) {
  const { question, options, topic } = req.body;
  if (!question || !options || !Array.isArray(options)) {
    return res.status(400).json({ message: 'Invalid test data' });
  }
  const newTest = await testService.createTest({ question, options, topic });
  res.status(201).json(newTest);
}

export async function updateTestHandler(req: Request, res: Response) {
  const { question, options, topic } = req.body;
  const updated = await testService.updateTest(req.params.id, { question, options, topic });
  if (!updated) return res.status(404).json({ message: 'Test not found' });
  res.json(updated);
}

export async function deleteTestHandler(req: Request, res: Response) {
  const deleted = await testService.deleteTest(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Test not found' });
  res.json({ success: true });
}

export async function createTestTopicHandler(req: Request, res: Response) {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Invalid topic data' });
  }
  const newTopic = await testService.createTestTopic({ title, description });
  res.status(201).json(newTopic);
}

export async function getAllTopicsHandler(req: Request, res: Response) {
  const topics = await testService.getAllTopics();
  res.json(topics);
}

export async function solveTestHandler(req: any, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
  const userId = req.user._id;
  const testId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const alreadySolved = user.solvedTests.some((t: any) => t.test.toString() === testId);
    if (!alreadySolved) {
      // Fetch the test and check the answer
      const test = await testService.getTestById(testId);
      if (!test) return res.status(404).json({ message: 'Test not found' });
      const { answer } = req.body; // Assume answer is sent in body
      const correctOption = test.options.find((opt: any) => opt.isCorrect);
      const isCorrect = !!(correctOption && answer === correctOption.text);
      user.solvedTests.push({ test: testId, isCorrect });
      user.points += isCorrect ? 10 : 0; // Only award points for correct answers
    }
    user.rank = Math.max(1, 1000 - user.points);
    await user.save();
    res.json({ solvedTests: user.solvedTests, points: user.points, rank: user.rank });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
} 