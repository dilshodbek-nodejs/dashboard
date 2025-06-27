import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  description: string;
  content: Array<{
    id: string;
    type: 'text' | 'image';
    content: string;
  }>;
  coverImage?: string;
  createdAt: string;
  status: string;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        const publishedBlogs = data
          .filter((blog: any) => blog.status === 'published')
          .map((blog: any) => ({
            ...blog,
            id: blog._id,
            createdAt: new Date(blog.createdAt)
          }))
          .sort((a: Blog, b: Blog) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBlogs(publishedBlogs);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      });
  }, []);

  const getImageUrl = (url: string) => {
    return url?.startsWith('http') ? url : url;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedBlog(null)}
            className="flex items-center text-gray-600 hover:text-red-500 mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Orqaga qaytish
          </button>
          
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {selectedBlog.coverImage && (
              <img 
                src={getImageUrl(selectedBlog.coverImage)} 
                alt={selectedBlog.title}
                className="w-full h-96 object-cover"
              />
            )}
            
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{selectedBlog.title}</h1>
              <p className="text-gray-600 mb-6 text-lg">{selectedBlog.description}</p>
              <div className="text-sm text-gray-500 mb-8">
                {formatDate(selectedBlog.createdAt)}
              </div>
              
              <div className="prose max-w-none">
                {selectedBlog.content.map(block =>
                  block.type === 'text' ? (
                    <p key={block.id} className="text-base text-gray-800 leading-relaxed mb-4">
                      {block.content}
                    </p>
                  ) : (
                    <img 
                      key={block.id} 
                      src={getImageUrl(block.content)} 
                      alt="Blog content" 
                      className="w-full rounded-lg my-6"
                    />
                  )
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Tarbiya maqolalari</h1>
          <p className="text-gray-600 text-lg">Bolalar tarbiyasi va ta'limi haqida foydali ma'lumotlar</p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Hozircha maqolalar mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <article 
                key={blog.id} 
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                {blog.coverImage && (
                  <img 
                    src={getImageUrl(blog.coverImage)} 
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </span>
                    <button className="text-red-500 hover:text-red-700 font-medium transition-colors">
                      O'qish
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage; 