import React, { useEffect, useState } from 'react';

type Blog = {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  status: string;
  content: { id: string; type: string; content: string }[];
};

const Blogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [modalBlog, setModalBlog] = useState<Blog | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/blogs')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setBlogs(data.filter((b: Blog) => b.status === 'published'));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const backendBaseUrl = 'http://15.235.141.2:5000';
  const visibleBlogs = showAll ? blogs : blogs.slice(0, 6);

  return (
    <section className="blogs background" id="blogs">
      <h1 className="heading">So'nggi bloglarimiz</h1>
      <div className="box-container" id="blog-posts-container">
        {loading && (
          Array.from({ length: 6 }).map((_, i) => (
            <div className="blog-card-custom" key={i}>
              <div style={{ height: 450, background: '#fdf0f5', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            </div>
          ))
        )}
        {error && (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'red' }}>Hikoyalarni yuklab bo'lmadi.</p>
        )}
        {!loading && !error && blogs.length === 0 && (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', fontSize: '1.2rem', color: '#666' }}>Hali hikoyalar topilmadi!</p>
        )}
        {!loading && !error && visibleBlogs.map((blog, index) => {
          const imageUrl = blog.coverImage
            ? (blog.coverImage.startsWith('http') ? blog.coverImage : backendBaseUrl + blog.coverImage)
            : '/images/s1.jpg';
          return (
            <div className="blog-card-custom" key={blog._id}>
              {index === 0 && !showAll && (
                <div className="latest-badge">
                  <span>So'nggi</span>
                </div>
              )}
              <img src={imageUrl} alt={blog.title} />
              <div className="content">
                <div>
                  <h2>{blog.title}</h2>
                  <h4>{blog.description.substring(0, 80)}...</h4>
                </div>
                <button className="btn-custom" onClick={() => setModalBlog(blog)}>Batafsil</button>
              </div>
            </div>
          );
        })}
      </div>
      {!showAll && blogs.length > 6 && !loading && !error && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            className="creative-read-more-btn"
            style={{
              minWidth: '130px',
              minHeight: '48px',
              fontSize: '1.2rem',
              fontWeight: 600,
              borderRadius: '1.5rem',
              background: '#f53b57',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(245,59,87,0.10)',
              border: 'none',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              margin: '0 auto',
              display: 'inline-block',
              outline: 'none',
              padding: '0.75rem 2.5rem',
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(245,59,87,0.18)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(245,59,87,0.10)'; }}
            onClick={() => setShowAll(true)}
          >
            Read More
          </button>
        </div>
      )}

      {/* Modal Popup */}
      {modalBlog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.45)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setModalBlog(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '1.5rem',
              maxWidth: 1125,
              width: '98vw',
              height: '95vh',
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
              padding: 0,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalBlog(null)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: '#f53b57',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 38,
                height: 38,
                fontSize: 22,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(245,59,87,0.10)',
                zIndex: 2,
              }}
              aria-label="Yopish"
            >×</button>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <img
                src={modalBlog.coverImage ? (modalBlog.coverImage.startsWith('http') ? modalBlog.coverImage : backendBaseUrl + modalBlog.coverImage) : '/images/s1.jpg'}
                alt={modalBlog.title}
                style={{ width: '100%', height: 400, objectFit: 'cover', borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem', background: '#f8f8f8', marginBottom: '1.5rem', flexShrink: 0 }}
              />
              <h2 style={{ fontSize: '2.5rem', color: '#f53b57', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2, marginLeft: 15, marginRight: 10 }}>{modalBlog.title}</h2>
              <div style={{ fontSize: '1.5rem', color: '#444', lineHeight: 1.8, whiteSpace: 'pre-line', overflowWrap: 'break-word', marginBottom: '1.2rem', marginLeft: 15, marginRight: 10 }}>{modalBlog.description}</div>
              {Array.isArray(modalBlog.content) && modalBlog.content.filter(c => c.type === 'text').map((c, i) => (
                <div
                  key={c.id || i}
                  style={{
                    fontSize: '1.79rem',
                    color: '#333',
                    marginBottom: 12,
                    lineHeight: 1.7,
                    marginLeft: 15,
                    marginRight: 10,
                  }}
                  dangerouslySetInnerHTML={{ __html: c.content }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blogs; 