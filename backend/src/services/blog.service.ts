import { BlogModel, Blog, ContentBlock } from '../models/blog.model';

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
    return BlogModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function deleteBlog(id: string): Promise<boolean> {
    const res = await BlogModel.findByIdAndDelete(id).exec();
    return !!res;
} 