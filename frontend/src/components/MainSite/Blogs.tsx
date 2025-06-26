import React, { useEffect, useState } from 'react';

type Blog = {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  status: string;
};

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/blogs')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setBlogs(data.filter((b: Blog) => b.status === 'published').slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="blogs background" id="blogs">
      <h1 className="heading">Our Latest Blogs</h1>
      <div className="box-container" id="blog-posts-container">
        {loading && (
          Array.from({ length: 3 }).map((_, i) => (
            <div className="blog-card-custom" key={i}>
              <div style={{ height: 450, background: '#fdf0f5', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            </div>
          ))
        )}
        {error && (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'red' }}>Could not load stories.</p>
        )}
        {!loading && !error && blogs.length === 0 && (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', fontSize: '1.2rem', color: '#666' }}>No stories found yet!</p>
        )}
        {!loading && !error && blogs.map((blog, index) => {
          const imageUrl = blog.coverImage
            ? (blog.coverImage.startsWith('http') ? blog.coverImage : `${blog.coverImage}`)
            : '/images/s1.jpg';
          return (
            <div className="blog-card-custom" key={blog._id}>
              {index === 0 && (
                <div className="latest-badge">
                  <span>Latest</span>
                </div>
              )}
              <img src={imageUrl} alt={blog.title} />
              <div className="content">
                <div>
                  <h2>{blog.title}</h2>
                  <h4>{blog.description.substring(0, 80)}...</h4>
                </div>
                <a href="#" className="btn-custom">Read More</a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Blogs; 