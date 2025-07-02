"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTests = listTests;
exports.getTest = getTest;
exports.createTestHandler = createTestHandler;
exports.updateTestHandler = updateTestHandler;
exports.deleteTestHandler = deleteTestHandler;
exports.createTestTopicHandler = createTestTopicHandler;
exports.getAllTopicsHandler = getAllTopicsHandler;
exports.solveTestHandler = solveTestHandler;
const testService = __importStar(require("../services/test.service"));
const user_model_1 = __importDefault(require("../models/user.model"));
async function listTests(req, res) {
    const tests = await testService.getAllTests();
    res.json(tests);
}
async function getTest(req, res) {
    const test = await testService.getTestById(req.params.id);
    if (!test)
        return res.status(404).json({ message: 'Test not found' });
    res.json(test);
}
async function createTestHandler(req, res) {
    const { question, options, topic } = req.body;
    if (!question || !options || !Array.isArray(options)) {
        return res.status(400).json({ message: 'Invalid test data' });
    }
    const newTest = await testService.createTest({ question, options, topic });
    res.status(201).json(newTest);
}
async function updateTestHandler(req, res) {
    const { question, options, topic } = req.body;
    const updated = await testService.updateTest(req.params.id, { question, options, topic });
    if (!updated)
        return res.status(404).json({ message: 'Test not found' });
    res.json(updated);
}
async function deleteTestHandler(req, res) {
    const deleted = await testService.deleteTest(req.params.id);
    if (!deleted)
        return res.status(404).json({ message: 'Test not found' });
    res.json({ success: true });
}
async function createTestTopicHandler(req, res) {
    const { title, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ message: 'Invalid topic data' });
    }
    const newTopic = await testService.createTestTopic({ title, description });
    res.status(201).json(newTopic);
}
async function getAllTopicsHandler(req, res) {
    const topics = await testService.getAllTopics();
    res.json(topics);
}
async function solveTestHandler(req, res) {
    if (!req.user)
        return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
    const userId = req.user._id;
    const testId = req.params.id;
    try {
        const user = await user_model_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const alreadySolved = user.solvedTests.some((t) => t.test.toString() === testId);
        if (!alreadySolved) {
            // Fetch the test and check the answer
            const test = await testService.getTestById(testId);
            if (!test)
                return res.status(404).json({ message: 'Test not found' });
            const { answer } = req.body; // Assume answer is sent in body
            const correctOption = test.options.find((opt) => opt.isCorrect);
            const isCorrect = !!(correctOption && answer === correctOption.text);
            user.solvedTests.push({ test: testId, isCorrect });
            user.points += isCorrect ? 10 : 0; // Only award points for correct answers
        }
        user.rank = Math.max(1, 1000 - user.points);
        await user.save();
        res.json({ solvedTests: user.solvedTests, points: user.points, rank: user.rank });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}
