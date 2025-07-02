import { Router } from 'express';
import { listTests, getTest, createTestHandler, updateTestHandler, deleteTestHandler, createTestTopicHandler, getAllTopicsHandler, solveTestHandler } from '../controllers/test.controller';
import { authenticateJWT } from '../middleware/auth';

const testRouter = Router();

testRouter.get('/topics', getAllTopicsHandler);
testRouter.post('/topic', createTestTopicHandler);
testRouter.get('/', listTests)
    .post('/', createTestHandler)
    .get('/:id', getTest)
    .put('/:id', updateTestHandler)
    .delete('/:id', deleteTestHandler)
    .post('/:id/solve', authenticateJWT, solveTestHandler);

export default testRouter; 