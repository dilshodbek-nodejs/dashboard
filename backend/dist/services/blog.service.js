"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlogs = getAllBlogs;
exports.getBlogById = getBlogById;
exports.createBlog = createBlog;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
const blog_model_1 = require("../models/blog.model");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function getAllBlogs() {
    return blog_model_1.BlogModel.find().sort({ createdAt: -1 }).exec();
}
async function getBlogById(id) {
    return blog_model_1.BlogModel.findById(id).exec();
}
async function createBlog(data) {
    const blog = new blog_model_1.BlogModel({ ...data });
    return blog.save();
}
async function updateBlog(id, data) {
    if (data.coverImage) {
        const existingBlog = await blog_model_1.BlogModel.findById(id);
        if (existingBlog && existingBlog.coverImage) {
            const oldImagePath = path_1.default.join(__dirname, '..', '..', 'uploads', path_1.default.basename(existingBlog.coverImage));
            if (fs_1.default.existsSync(oldImagePath)) {
                fs_1.default.unlinkSync(oldImagePath);
            }
        }
    }
    return blog_model_1.BlogModel.findByIdAndUpdate(id, data, { new: true }).exec();
}
async function deleteBlog(id) {
    const blog = await blog_model_1.BlogModel.findById(id);
    if (blog && blog.coverImage) {
        const imagePath = path_1.default.join(__dirname, '..', '..', 'uploads', path_1.default.basename(blog.coverImage));
        if (fs_1.default.existsSync(imagePath)) {
            fs_1.default.unlinkSync(imagePath);
        }
    }
    const res = await blog_model_1.BlogModel.findByIdAndDelete(id).exec();
    return !!res;
}
