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
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBlogs = listBlogs;
exports.getBlog = getBlog;
exports.createBlogHandler = createBlogHandler;
exports.updateBlogHandler = updateBlogHandler;
exports.deleteBlogHandler = deleteBlogHandler;
const blogService = __importStar(require("../services/blog.service"));
async function listBlogs(req, res) {
    const blogs = await blogService.getAllBlogs();
    res.json(blogs);
}
async function getBlog(req, res) {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog)
        return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
}
async function createBlogHandler(req, res) {
    const { title, description, content, coverImage, status } = req.body;
    if (!title || !description || !content || !Array.isArray(content) || !status) {
        return res.status(400).json({ message: 'Invalid blog data' });
    }
    const newBlog = await blogService.createBlog({ title, description, content, coverImage, status });
    res.status(201).json(newBlog);
}
async function updateBlogHandler(req, res) {
    const { title, description, content, coverImage, status } = req.body;
    const updated = await blogService.updateBlog(req.params.id, { title, description, content, coverImage, status });
    if (!updated)
        return res.status(404).json({ message: 'Blog not found' });
    res.json(updated);
}
async function deleteBlogHandler(req, res) {
    const deleted = await blogService.deleteBlog(req.params.id);
    if (!deleted)
        return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true });
}
