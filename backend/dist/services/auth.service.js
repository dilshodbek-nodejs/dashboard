"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const registerUser = async (username, email, password) => {
    const existingUser = await user_model_1.default.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
        throw new Error('User already exists');
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = new user_model_1.default({ username, email, password: hashedPassword });
    await user.save();
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (username, password) => {
    const user = await user_model_1.default.findOne({ username });
    if (!user)
        throw new Error('Invalid credentials');
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error('Invalid credentials');
    const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
};
exports.loginUser = loginUser;
