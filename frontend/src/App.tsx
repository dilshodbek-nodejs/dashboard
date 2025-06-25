import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TestCreation } from './components/TestCreation';
import { BlogCreation } from './components/BlogCreation';
import { TestList } from './components/TestList';
import { BlogList } from './components/BlogList';
import { Test, Blog } from './types';

const baseUri = 'http://localhost:4000/api';
const backendBaseUrl = 'http://localhost:4000';
const getImageUrl = (url) => url?.startsWith('http') ? url : backendBaseUrl + url;

function App() {
  const [activeSection, setActiveSection] = useState<'tests' | 'blogs'>('tests');
  const [tests, setTests] = useState<Test[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);

  // Fetch tests and blogs from backend on mount
  useEffect(() => {
    fetch(`${baseUri}/tests`)
      .then(res => res.json())
      .then(data => setTests(data.map((t: any) => ({ ...t, id: t._id }))));
    fetch(`${baseUri}/blogs`)
      .then(res => res.json())
      .then(data => setBlogs(
        data.map((b: any) => ({
          ...b,
          id: b._id,
          createdAt: new Date(b.createdAt)
        }))
      ));
  }, []);

  const handleTestCreate = async (testData: Omit<Test, 'id' | 'createdAt'>) => {
    const res = await fetch(`${baseUri}/tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    const newTest = await res.json();
    setTests(prev => [newTest, ...prev]);
  };

  const handleTestUpdate = async (updatedTest: Test) => {
    const res = await fetch(`${baseUri}/tests/${updatedTest.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: updatedTest.question, options: updatedTest.options })
    });
    const newTest = await res.json();
    setTests(prev => prev.map(test => test.id === newTest._id ? { ...newTest, id: newTest._id } : test));
    setEditingTest(null);
  };

  const handleBlogCreate = async (blogData: Omit<Blog, 'id' | 'createdAt'>) => {
    const res = await fetch(`${baseUri}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blogData)
    });
    const newBlog = await res.json();
    setBlogs(prev => [
      { ...newBlog, id: newBlog._id, createdAt: new Date(newBlog.createdAt) },
      ...prev
    ]);
    if (blogData.status === 'published') {
      setViewBlog({ ...newBlog, id: newBlog._id, createdAt: new Date(newBlog.createdAt) });
    }
  };

  const handleBlogUpdate = async (updatedBlog: Blog) => {
    const res = await fetch(`${baseUri}/blogs/${updatedBlog.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedBlog.title,
        description: updatedBlog.description,
        content: updatedBlog.content,
        coverImage: updatedBlog.coverImage,
        status: updatedBlog.status
      })
    });
    const newBlog = await res.json();
    setBlogs(prev => prev.map(blog => blog.id === newBlog._id ? { ...newBlog, id: newBlog._id } : blog));
    setEditingBlog(null);
  };

  const handleTestEdit = (test: Test) => {
    setEditingTest(test);
  };

  const handleBlogEdit = (blog: Blog) => {
    setEditingBlog(blog);
  };

  const cancelEdit = () => {
    setEditingTest(null);
    setEditingBlog(null);
  };

  const handleTestDelete = async (id: string) => {
    await fetch(`${baseUri}/tests/${id}`, { method: 'DELETE' });
    setTests(prev => prev.filter(test => test.id !== id));
  };

  const handleBlogDelete = async (id: string) => {
    await fetch(`${baseUri}/blogs/${id}`, { method: 'DELETE' });
    setBlogs(prev => prev.filter(blog => blog.id !== id));
  };

  const handleBlogView = (blog: Blog) => {
    setViewBlog(blog);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Blog view popup */}
      {viewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button onClick={() => setViewBlog(null)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl">&times;</button>
            {viewBlog.coverImage && (
              <img src={getImageUrl(viewBlog.coverImage)} alt="Cover" className="w-full h-48 object-cover rounded mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2">{viewBlog.title}</h2>
            <p className="text-gray-600 mb-4">{viewBlog.description}</p>
            <div className="space-y-4">
              {viewBlog.content.map(block =>
                block.type === 'text' ? (
                  <p key={block.id} className="text-base text-gray-800">{block.content}</p>
                ) : (
                  <img key={block.id} src={getImageUrl(block.content)} alt="Blog" className="w-full rounded" />
                )
              )}
            </div>
          </div>
        </div>
      )}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <main className="flex-1 lg:ml-64">
        <div className="p-6">
          {activeSection === 'tests' ? (
            <div className="space-y-8">
              <TestCreation 
                onTestCreate={handleTestCreate}
                onTestUpdate={handleTestUpdate}
                editingTest={editingTest}
                onCancelEdit={cancelEdit}
              />
              <TestList tests={tests} onTestEdit={handleTestEdit} onTestDelete={handleTestDelete} />
            </div>
          ) : (
            <div className="space-y-8">
              <BlogCreation 
                onBlogCreate={handleBlogCreate}
                onBlogUpdate={handleBlogUpdate}
                editingBlog={editingBlog}
                onCancelEdit={cancelEdit}
              />
              <BlogList blogs={blogs} onBlogEdit={handleBlogEdit} onBlogDelete={handleBlogDelete} onBlogView={handleBlogView} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;