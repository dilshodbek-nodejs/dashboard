import { TestModel, Test, TestOption, TestTopicModel, TestTopic } from '../models/test.model';

export async function getAllTests(): Promise<Test[]> {
    return TestModel.find().sort({ createdAt: -1 }).exec();
}

export async function getTestById(id: string): Promise<Test | null> {
    return TestModel.findById(id).exec();
}

export async function createTest(data: { question: string; options: TestOption[]; topic?: string }): Promise<Test> {
    const test = new TestModel({ ...data });
    return test.save();
}

export async function updateTest(id: string, data: { question: string; options: TestOption[]; topic?: string }): Promise<Test | null> {
    return TestModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function deleteTest(id: string): Promise<boolean> {
    const res = await TestModel.findByIdAndDelete(id).exec();
    return !!res;
}

export async function createTestTopic(data: { title: string; description: string }): Promise<TestTopic> {
    const topic = new TestTopicModel({ ...data });
    return topic.save();
}

export async function getAllTopics(): Promise<TestTopic[]> {
    return TestTopicModel.find().sort({ createdAt: -1 }).exec();
} 