import React from 'react';
import { Calendar, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { Blog } from '../types';

interface BlogListProps {
  blogs: Blog[];
  onBlogEdit: (blog: Blog) => void;
  onBlogDelete: (id: string) => void;
  onBlogView: (blog: Blog) => void;
}

const getImageUrl = (url: string | null) => {

  const isProd=false
  let backendBaseUrl;
  
  
  if (isProd) {
    backendBaseUrl = '';
  } else {
    backendBaseUrl = 'http://localhost:5000';
  }
  
  if (!url) return 'https://via.placeholder.com/150'; // Fallback image
  return url.startsWith('http') ? url : backendBaseUrl + url;
};

export const BlogList: React.FC<BlogListProps> = ({ blogs, onBlogEdit, onBlogDelete, onBlogView }) => {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts created</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first post.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Published Posts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="card flex flex-col justify-between overflow-hidden">
            <div>
              <img
                src={getImageUrl(blog.coverImage)}
                alt={blog.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="text-base font-semibold text-gray-900 truncate mb-2" title={blog.title}>{blog.title}</h4>
                <p className="text-sm text-gray-500 hidden md:line-clamp-2">{blog.description}</p>
                <div className="text-xs text-gray-400 mt-2 hidden md:flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 border-t border-gray-100 p-3 bg-gray-50">
              <button
                onClick={() => onBlogView(blog)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View post"
              >
                <Eye size={16} />
              </button>
              <button
                onClick={() => onBlogEdit(blog)}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit post"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onBlogDelete(blog.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete post"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};