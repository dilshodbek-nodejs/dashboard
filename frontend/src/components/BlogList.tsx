import React from 'react';
import { Calendar, PenTool, Edit, FileText, X } from 'lucide-react';
import { Blog } from '../types';

interface BlogListProps {
  blogs: Blog[];
  onBlogEdit: (blog: Blog) => void;
  onBlogDelete: (id: string) => void;
  onBlogView: (blog: Blog) => void;
}

const backendBaseUrl = 'http://localhost:4000';
const getImageUrl = (url: string) => url?.startsWith('http') ? url : backendBaseUrl + url;

export const BlogList: React.FC<BlogListProps> = ({ blogs, onBlogEdit, onBlogDelete, onBlogView }) => {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <PenTool className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts created</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first blog post.</p>
      </div>
    );
  }

  const publishedBlogs = blogs.filter(blog => blog.status === 'published');
  const draftBlogs = blogs.filter(blog => blog.status === 'draft');

  const BlogCard = ({ blog }: { blog: Blog }) => (
    <div key={blog.id} className="card">
      <div className="flex space-x-4">
        {blog.coverImage && (
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(blog.coverImage)}
              alt={blog.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{blog.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  blog.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {blog.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{blog.description}</p>
              <div className="text-xs text-gray-500">
                {blog.content.filter(block => block.type === 'text').length} text blocks, {' '}
                {blog.content.filter(block => block.type === 'image').length} images
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {blog.status === 'published' && (
                <button
                  onClick={() => onBlogView(blog)}
                  className="p-2 text-blue-500 hover:text-blue-700 rounded-lg transition-colors"
                  title="View blog post"
                >
                  View
                </button>
              )}
              <button
                onClick={() => onBlogEdit(blog)}
                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Edit blog post"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onBlogDelete(blog.id)}
                className="p-2 text-red-500 hover:text-red-700 rounded-lg transition-colors"
                title="Delete blog post"
              >
                <X size={16} />
              </button>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar size={14} />
                <span>{blog.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {publishedBlogs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <PenTool size={20} className="text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Published Posts</h3>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              {publishedBlogs.length}
            </span>
          </div>
          {publishedBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}

      {draftBlogs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileText size={20} className="text-yellow-600" />
            <h3 className="text-lg font-medium text-gray-900">Draft Posts</h3>
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              {draftBlogs.length}
            </span>
          </div>
          {draftBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};