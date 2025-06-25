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
  const { question, options } = req.body;
  if (!question || !options || !Array.isArray(options)) {
    return res.status(400).json({ message: 'Invalid test data' });
  }
  const newTest = await testService.createTest({ question, options });
  res.status(201).json(newTest);
}

export async function updateTestHandler(req: Request, res: Response) {
  const { question, options } = req.body;
  const updated = await testService.updateTest(req.params.id, { question, options });
  if (!updated) return res.status(404).json({ message: 'Test not found' });
  res.json(updated);
}

export async function deleteTestHandler(req: Request, res: Response) {
  const deleted = await testService.deleteTest(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Test not found' });
  res.json({ success: true });
} 