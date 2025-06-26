import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Blog, ContentBlock } from '../types';
import { DynamicEditor } from './DynamicEditor';

interface BlogCreationProps {
  onBlogCreate: (blog: Omit<Blog, 'id' | 'createdAt'>) => void;
  onBlogUpdate?: (blog: Blog) => void;
  editingBlog?: Blog | null;
  onCancelEdit?: () => void;
}

const backendBaseUrl = 'http://15.235.141.2:5000';
const getImageUrl = (url:any) => url?.startsWith('http') ? url : backendBaseUrl + url;

export const BlogCreation: React.FC<BlogCreationProps> = ({ 
  onBlogCreate, 
  onBlogUpdate, 
  editingBlog, 
  onCancelEdit 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [content, setContent] = useState<ContentBlock[]>([]);

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title);
      setDescription(editingBlog.description);
      setCoverImage(editingBlog.coverImage);
      setContent(editingBlog.content);
    }
  }, [editingBlog]);

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(backendBaseUrl + '/api/blogs/upload-image', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setCoverImage(backendBaseUrl + data.url);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCoverImage(null);
    setContent([]);
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    const blogData = {
      title,
      description,
      content: content.filter(block => block.content.trim() !== ''),
      coverImage,
      status
    };
    if (editingBlog) {
      onBlogUpdate?.({ ...editingBlog, ...blogData });
    } else {
      onBlogCreate?.(blogData);
    }
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter blog title..."
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Enter blog description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            {coverImage ? (
              <div className="relative inline-block">
                <img
                  src={getImageUrl(coverImage)}
                  alt="Cover"
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <span className="text-primary-600 hover:text-primary-700 font-medium">
                      Upload cover image
                    </span>
                    <input
                      id="cover-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <DynamicEditor content={content} onChange={setContent} />
          </div>

          <div className="flex justify-end space-x-3">
            {editingBlog && (
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              className="btn-secondary"
            >
              Save Draft
            </button>
            <button 
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              className="btn-primary"
            >
              {editingBlog ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};