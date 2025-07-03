"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ "origin": "*" }));
app.use(body_parser_1.default.json({ limit: '150mb' }));
app.use(express_1.default.json({ limit: '150mb' }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/estetik-tarbiya';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/blogs', blog_routes_1.default);
app.use('/api/tests', test_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
exports.default = app;
