import { Router } from 'express';
import { listTests, getTest, createTestHandler, updateTestHandler, deleteTestHandler } from '../controllers/test.controller';

const testRouter = Router();

testRouter.get('/', listTests)
    .post('/', createTestHandler)
    .get('/:id', getTest)
    .put('/:id', updateTestHandler)
    .delete('/:id', deleteTestHandler);

export default testRouter; 