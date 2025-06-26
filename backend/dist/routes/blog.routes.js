"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("../controllers/blog.controller");
const multer_1 = require("../middleware/multer");
const blogRouter = (0, express_1.Router)();
// Image upload endpoint
blogRouter.post('/upload-image', multer_1.upload.single('image'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
});
blogRouter.get('/', blog_controller_1.listBlogs)
    .post('/', blog_controller_1.createBlogHandler)
    .get('/:id', blog_controller_1.getBlog)
    .put('/:id', blog_controller_1.updateBlogHandler)
    .delete('/:id', blog_controller_1.deleteBlogHandler);
exports.default = blogRouter;
