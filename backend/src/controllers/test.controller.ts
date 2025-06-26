import { Request, Response } from 'express';
import * as testService from '../services/test.service';

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