"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token yo\'q' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await user_model_1.default.findById(decoded.userId).select('-password');
        if (!user)
            return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token noto\'g\'ri yoki eskirgan' });
    }
};
exports.authenticateJWT = authenticateJWT;
