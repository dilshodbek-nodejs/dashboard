"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await user_model_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = new user_model_1.default({ username, email, password: hashedPassword });
        await user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        // Return user data (excluding password)
        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                points: user.points,
                rank: user.rank
            }
        });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await user_model_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token });
    }
    catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};
exports.login = login;
