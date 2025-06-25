import { Request, Response } from 'express';
import * as blogService from '../services/blog.service';

export async function listBlogs(req: Request, res: Response) {
    const blogs = await blogService.getAllBlogs();
    res.json(blogs);
}

export async function getBlog(req: Request, res: Response) {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
}

export async function createBlogHandler(req: Request, res: Response) {
    const { title, description, content, coverImage, status } = req.body;
    if (!title || !description || !content || !Array.isArray(content) || !status) {
        return res.status(400).json({ message: 'Invalid blog data' });
    }
    const newBlog = await blogService.createBlog({ title, description, content, coverImage, status });
    res.status(201).json(newBlog);
}

export async function updateBlogHandler(req: Request, res: Response) {
    const { title, description, content, coverImage, status } = req.body;
    const updated = await blogService.updateBlog(req.params.id, { title, description, content, coverImage, status });
    if (!updated) return res.status(404).json({ message: 'Blog not found' });
    res.json(updated);
}

export async function deleteBlogHandler(req: Request, res: Response) {
    const deleted = await blogService.deleteBlog(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true });
} 