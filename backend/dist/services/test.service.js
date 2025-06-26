"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTests = getAllTests;
exports.getTestById = getTestById;
exports.createTest = createTest;
exports.updateTest = updateTest;
exports.deleteTest = deleteTest;
const test_model_1 = require("../models/test.model");
async function getAllTests() {
    return test_model_1.TestModel.find().sort({ createdAt: -1 }).exec();
}
async function getTestById(id) {
    return test_model_1.TestModel.findById(id).exec();
}
async function createTest(data) {
    const test = new test_model_1.TestModel({ ...data });
    return test.save();
}
async function updateTest(id, data) {
    return test_model_1.TestModel.findByIdAndUpdate(id, data, { new: true }).exec();
}
async function deleteTest(id) {
    const res = await test_model_1.TestModel.findByIdAndDelete(id).exec();
    return !!res;
}
