"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRanks = exports.updateProfileAvatar = exports.updateProfile = exports.saveQuizResult = exports.getProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const test_model_1 = require("../models/test.model");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getProfile = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
    // Populate solvedTests.test
    const user = await user_model_1.default.findById(req.user._id).populate('solvedTests.test');
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    const { _id, username, email, createdAt, updatedAt, points, solvedQuizPacks, solvedTests } = user;
    // Fetch topic titles and stats for solvedQuizPacks
    let solvedQuizPackDetails = [];
    if (Array.isArray(solvedQuizPacks) && solvedQuizPacks.length > 0) {
        const topics = await test_model_1.TestTopicModel.find({ _id: { $in: solvedQuizPacks } });
        for (const id of solvedQuizPacks) {
            const topic = topics.find(t => t._id.toString() === id.toString());
            // Get all tests in this topic
            const allTests = await test_model_1.TestModel.find({ topic: id });
            const totalTests = allTests.length;
            // User's solved tests in this topic
            const solvedInPack = solvedTests.filter((t) => t.test && t.test.topic && t.test.topic.toString() === id.toString());
            const solvedCount = solvedInPack.length;
            const correctCount = solvedInPack.filter((t) => t.isCorrect).length;
            const percentCorrect = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;
            solvedQuizPackDetails.push({
                id,
                title: topic ? topic.title : "Noma'lum to'plam",
                totalTests,
                solvedTests: solvedCount,
                correctTests: correctCount,
                percentCorrect
            });
        }
    }
    // Global stats
    const allTopics = await test_model_1.TestTopicModel.find();
    const allTests = await test_model_1.TestModel.find();
    const totalTestPacks = allTopics.length;
    const solvedTestPacks = solvedQuizPacks.length;
    const totalTests = allTests.length;
    const solvedTestsCount = solvedTests.length;
    const correctTestsCount = solvedTests.filter((t) => t.isCorrect).length;
    const percentCorrect = solvedTestsCount > 0 ? Math.round((correctTestsCount / solvedTestsCount) * 100) : 0;
    const globalStats = {
        totalTestPacks,
        solvedTestPacks,
        totalTests,
        solvedTests: solvedTestsCount,
        correctTests: correctTestsCount,
        percentCorrect
    };
    // Rank table (top 10 users by points)
    const rankTable = await user_model_1.default.find({}, 'username points')
        .sort({ points: -1 })
        .limit(10)
        .lean();
    rankTable.forEach((u, i) => { u.rank = i + 1; });
    // Calculate user's real rank
    const allUsers = await user_model_1.default.find({}, 'points').sort({ points: -1 }).lean();
    const userRank = allUsers.findIndex((u) => String(u._id) === String(user._id)) + 1;
    const totalUsers = allUsers.length;
    res.json({ _id, username, email, createdAt, updatedAt, points, userRank, totalUsers, solvedQuizPacks: solvedQuizPackDetails, globalStats, rankTable });
};
exports.getProfile = getProfile;
const saveQuizResult = async (req, res) => {
    const { topicId, points, total } = req.body;
    if (!topicId || typeof points !== 'number' || typeof total !== 'number') {
        return res.status(400).json({ message: 'Invalid quiz result data' });
    }
    const user = await user_model_1.default.findById(req.user._id);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    if (!user.solvedQuizPacks.includes(topicId)) {
        user.solvedQuizPacks.push(topicId);
        // Business logic: 10 points per correct answer, 10 bonus for perfect score
        let earned = points * 10;
        if (points === total)
            earned += 10;
        user.points += earned;
        // Optionally update rank here
        user.rank = Math.max(1, 1000 - user.points);
        await user.save();
        return res.json({ success: true, points: user.points, solvedQuizPacks: user.solvedQuizPacks, earned });
    }
    else {
        return res.json({ success: false, message: 'Quiz pack already solved', points: user.points, solvedQuizPacks: user.solvedQuizPacks });
    }
};
exports.saveQuizResult = saveQuizResult;
// Update user profile
const updateProfile = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
    const { username, email, firstName, lastName, avatar } = req.body;
    try {
        const user = await user_model_1.default.findById(req.user._id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (firstName !== undefined)
            user.firstName = firstName;
        if (lastName !== undefined)
            user.lastName = lastName;
        if (avatar !== undefined)
            user.avatar = avatar;
        await user.save();
        res.json({ success: true, user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                updatedAt: user.updatedAt
            } });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.updateProfile = updateProfile;
// Update user avatar (file upload)
const updateProfileAvatar = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
    if (!req.file)
        return res.status(400).json({ message: 'Fayl topilmadi' });
    try {
        console.log('Avatar upload:', req.file);
        const user = await user_model_1.default.findById(req.user._id);
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Remove old avatar file if it exists and is not the default
        if (user.avatar && user.avatar.startsWith('/uploads/')) {
            const oldAvatarPath = path_1.default.join(__dirname, '../../', user.avatar);
            fs_1.default.unlink(oldAvatarPath, (err) => {
                if (err) {
                    console.warn('Failed to remove old avatar:', err.message);
                }
                else {
                    console.log('Old avatar removed:', oldAvatarPath);
                }
            });
        }
        // Save relative path to avatar
        const avatarPath = `/uploads/${req.file.filename}`;
        user.avatar = avatarPath;
        await user.save();
        console.log('Avatar saved:', avatarPath);
        res.json({ success: true, avatar: user.avatar });
    }
    catch (err) {
        console.error('Avatar upload error:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.updateProfileAvatar = updateProfileAvatar;
const getAllRanks = async (req, res) => {
    try {
        const users = await user_model_1.default.find({}, 'username points avatar')
            .sort({ points: -1 })
            .lean();
        users.forEach((u, i) => { u.rank = i + 1; });
        res.json({ users });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.getAllRanks = getAllRanks;
