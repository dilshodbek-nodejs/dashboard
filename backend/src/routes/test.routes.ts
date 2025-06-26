import { Router } from 'express';
import { listTests, getTest, createTestHandler, updateTestHandler, deleteTestHandler, createTestTopicHandler, getAllTopicsHandler } from '../controllers/test.controller';

const testRouter = Router();

testRouter.get('/topics', getAllTopicsHandler);
testRouter.post('/topic', createTestTopicHandler);
testRouter.get('/', listTests)
    .post('/', createTestHandler)
    .get('/:id', getTest)
    .put('/:id', updateTestHandler)
    .delete('/:id', deleteTestHandler);

export default testRouter; 