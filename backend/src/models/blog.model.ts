import mongoose, { Document, Schema } from 'mongoose';

export interface ContentBlock {
    id: string;
    type: 'text' | 'image';
    content: string;
    order: number;
}

export interface Blog extends Document {
    title: string;
    description: string;
    content: ContentBlock[];
    coverImage: string | null;
    createdAt: Date;
    status: 'draft' | 'published';
}

const ContentBlockSchema = new Schema<ContentBlock>({
    id: { type: String, required: true },
    type: { type: String, enum: ['text', 'image'], required: true },
    content: { type: String, required: true },
    order: { type: Number, required: true }
}, { _id: false });

const BlogSchema = new Schema<Blog>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: [ContentBlockSchema], required: true },
    coverImage: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'published'], required: true }
});

export const BlogModel = mongoose.model<Blog>('Blog', BlogSchema); 