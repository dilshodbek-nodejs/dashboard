import { BlogModel, Blog, ContentBlock } from '../models/blog.model';
import fs from 'fs';
import path from 'path';

export async function getAllBlogs(): Promise<Blog[]> {
    return BlogModel.find().sort({ createdAt: -1 }).exec();
}

export async function getBlogById(id: string): Promise<Blog | null> {
    return BlogModel.findById(id).exec();
}

export async function createBlog(data: { title: string; description: string; content: ContentBlock[]; coverImage: string | null; status: 'draft' | 'published' }): Promise<Blog> {
    const blog = new BlogModel({ ...data });
    return blog.save();
}

export async function updateBlog(id: string, data: { title: string; description: string; content: ContentBlock[]; coverImage: string | null; status: 'draft' | 'published' }): Promise<Blog | null> {
    if (data.coverImage) {
        const existingBlog = await BlogModel.findById(id);
        if (existingBlog && existingBlog.coverImage) {
            const oldImagePath = path.join(__dirname, '..', '..', 'uploads', path.basename(existingBlog.coverImage));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
    }
    
    return BlogModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function deleteBlog(id: string): Promise<boolean> {
    const blog = await BlogModel.findById(id);

    if (blog && blog.coverImage) {
        const imagePath = path.join(__dirname, '..', '..', 'uploads', path.basename(blog.coverImage));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    const res = await BlogModel.findByIdAndDelete(id).exec();
    return !!res;
} 