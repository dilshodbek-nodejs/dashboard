"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = require("../controllers/test.controller");
const testRouter = (0, express_1.Router)();
testRouter.get('/topics', test_controller_1.getAllTopicsHandler);
testRouter.post('/topic', test_controller_1.createTestTopicHandler);
testRouter.get('/', test_controller_1.listTests)
    .post('/', test_controller_1.createTestHandler)
    .get('/:id', test_controller_1.getTest)
    .put('/:id', test_controller_1.updateTestHandler)
    .delete('/:id', test_controller_1.deleteTestHandler);
exports.default = testRouter;
