import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TestCreation } from './components/TestCreation';
import { BlogCreation } from './components/BlogCreation';
import { TestList } from './components/TestList';
import { BlogList } from './components/BlogList';
import { Test, Blog } from './types';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import QuizPage from './components/QuizPage';
import MainSiteApp from './components/MainSite/MainSiteApp';
import BlogPage from './components/MainSite/BlogPage';
import Login from './components/MainSite/Login';
import Register from './components/MainSite/Register';
import Profile from './components/MainSite/Profile';
import Ranks from './components/MainSite/Ranks';



const baseUri = '/api';

const isProd=true
let backendBaseUrl;

if (isProd) {
  backendBaseUrl = '';
} else {
  backendBaseUrl = 'http://localhost:5000';
}
console.log(isProd)
const getImageUrl = (url: any) => url?.startsWith('http') ? url : backendBaseUrl + url;

function MainDashboard() {
  const [activeSection, setActiveSection] = useState<'tests' | 'blogs' | 'topics'>('tests');
  const [tests, setTests] = useState<Test[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [viewBlog, setViewBlog] = useState<Blog | null>(null);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [topicSuccess, setTopicSuccess] = useState('');
  const [topicError, setTopicError] = useState('');

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
    setTests(prev => [{ ...newTest, id: newTest._id }, ...prev]);
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

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopicSuccess('');
    setTopicError('');
    try {
      const res = await fetch(`${baseUri}/tests/topic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topicTitle, description: topicDescription })
      });
      if (!res.ok) throw new Error('Failed to create topic');
      setTopicSuccess('Topic created successfully!');
      setTopicTitle('');
      setTopicDescription('');
      setShowTopicForm(false);
    } catch (err) {
      setTopicError('Failed to create topic');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Blog view popup */}
      {viewBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setViewBlog(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-4xl leading-none z-10 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex-1 overflow-y-auto pr-4 -mr-4 custom-scrollbar">
              {viewBlog.coverImage && (
                <img src={getImageUrl(viewBlog.coverImage)} alt="Cover" className="w-full h-64 object-cover rounded-lg mb-4" />
              )}
              <h2 className="text-3xl font-bold mb-2 pr-8">{viewBlog.title}</h2>
              <p className="text-gray-600 mb-6">{viewBlog.description}</p>
              <div className="space-y-4 prose max-w-none">
                {viewBlog.content.map(block =>
                  block.type === 'text' ? (
                    <p key={block.id} className="text-base text-gray-800">{block.content}</p>
                  ) : (
                    <img key={block.id} src={getImageUrl(block.content)} alt="Blog" className="w-full rounded-lg my-4" />
                  )
                )}
              </div>
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

      <main className="flex-1 lg:ml-64 min-w-0">
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
          ) : activeSection === 'blogs' ? (
            <div className="space-y-8">
              <BlogCreation
                onBlogCreate={handleBlogCreate}
                onBlogUpdate={handleBlogUpdate}
                editingBlog={editingBlog}
                onCancelEdit={cancelEdit}
              />
              <BlogList blogs={blogs} onBlogEdit={handleBlogEdit} onBlogDelete={handleBlogDelete} onBlogView={handleBlogView} />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <form onSubmit={handleCreateTopic} className="mt-4 w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={e => setTopicTitle(e.target.value)}
                    className="input-field"
                    placeholder="Enter topic title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={topicDescription}
                    onChange={e => setTopicDescription(e.target.value)}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Enter topic description"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button type="submit" className="btn-primary">Create</button>
                </div>
                {topicSuccess && <div className="text-green-600 text-sm mt-2">{topicSuccess}</div>}
                {topicError && <div className="text-red-600 text-sm mt-2">{topicError}</div>}
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = getCookie('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const location = useLocation();
  const isQuizPage = location.pathname === '/quiz';
  return (
    <Routes>
      <Route path="/admin/*" element={
        <div>
          <Routes>
            <Route path="" element={
              <div style={{ width: '100vw', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
                <div style={{ transform: 'scale(1.7)', transformOrigin: 'top center', width: '58.8vw' }}>
                  <MainDashboard />
                </div>
              </div>
            } />
            <Route path="quiz" element={<QuizPage />} />
          </Routes>
        </div>
      } />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/me" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/ranks" element={<Ranks />} />
      <Route path="/*" element={<MainSiteApp />} />
    </Routes>
  );
}

export default App;