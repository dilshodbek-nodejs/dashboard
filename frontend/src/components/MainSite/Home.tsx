import React, { useEffect, useRef, useState } from 'react';

// Blog type for this slider
interface Blog {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  status: string;
  content: { id: string; type: string; content: string }[];
}

const backendBaseUrl = '';

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [modalBlog, setModalBlog] = useState<Blog | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data.filter((b: Blog) => b.status === 'published').slice(0, 12));
        setLoading(false);
      })
      .catch(err => {
        setError('Bloglar yuklab bo‘lmadi');
        setLoading(false);
      });
  }, []);

  // ====== SLIDER LOGIC START ======
  useEffect(() => {
    if (!sliderRef.current || blogs.length === 0) return;
    const slider = sliderRef.current;
    const isMobile = windowWidth < 768;
    const speed = isMobile ? 0.3 : 0.7; // px per frame
    let animationFrame: number;
    let paused = false;
    let touchTimeout: NodeJS.Timeout | null = null;
    const totalWidth = slider.scrollWidth;
    function animate() {
      if (!slider || paused) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      const nextScroll = slider.scrollLeft + speed;
      if (nextScroll >= totalWidth / 2) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft = nextScroll;
      }
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    // Pause/resume logic
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    if (!isMobile) {
      slider.addEventListener('mouseenter', pause);
      slider.addEventListener('mouseleave', resume);
    } else {
      slider.addEventListener('touchstart', pause);
      const touchEndHandler = () => {
        if (touchTimeout) clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => { paused = false; }, 1000);
      };
      slider.addEventListener('touchend', touchEndHandler);
    }
    return () => {
      cancelAnimationFrame(animationFrame);
      if (!isMobile) {
        slider.removeEventListener('mouseenter', pause);
        slider.removeEventListener('mouseleave', resume);
      } else {
        slider.removeEventListener('touchstart', pause);
        slider.removeEventListener('touchend', () => {});
        if (touchTimeout) clearTimeout(touchTimeout);
      }
    };
  }, [blogs, windowWidth]);
  // ====== SLIDER LOGIC END ======

  // Render blogs twice for seamless infinite loop
  const sliderBlogs = blogs.length > 0 ? [...blogs, ...blogs] : [];
  // ===== MOBILE VERSION CODE START =====
  const isMobile = windowWidth < 768;
  // ===== MOBILE VERSION CODE END =====

  return (
    <section className="home background" id="home" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 className="heading hidden sm:block" style={{ marginBottom: '2rem' }}>So‘nggi bloglar</h1>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#f53b57', fontSize: '2rem' }}>Yuklanmoqda...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', fontSize: '2rem' }}>Bloglarni yuklab bo‘lmadi</div>
      ) : isMobile ? (
        blogs.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div
              style={{
                minWidth: '98vw',
                maxWidth: '98vw',
                background: '#fff',
                borderRadius: '1.2rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                border: '1px solid #f3f3f3',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.18s, box-shadow 0.18s',
                position: 'relative',
                height: 492,
                margin: '0 auto',
              }}
              className="blog-card-custom"
            >
              {/* Badge */}
              <div style={{ position: 'absolute', top: 18, left: 18, background: '#f53b57', color: '#fff', fontSize: '1.2rem', fontWeight: 700, padding: '0.35rem 1.2rem', borderRadius: '1.2rem', zIndex: 2, boxShadow: '0 2px 8px rgba(245,59,87,0.10)' }}>
                Eng ko‘p o‘qilgan
              </div>
              <img
                src={blogs[0].coverImage ? (blogs[0].coverImage.startsWith('http') ? blogs[0].coverImage : backendBaseUrl + blogs[0].coverImage) : '/images/s1.jpg'}
                alt={blogs[0].title}
                style={{ width: '100%', height: 295, objectFit: 'cover', borderTopLeftRadius: '1.2rem', borderTopRightRadius: '1.2rem', background: '#f8f8f8' }}
              />
              <div style={{ padding: '2rem 2rem 2.5rem 2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '2.38rem', color: '#f53b57', marginBottom: '1.2rem', fontWeight: 700, lineHeight: 1.2, marginLeft: 15, marginRight: 10 }}>{blogs[0].title}</h2>
                <h4 style={{ fontSize: '1.74rem', color: '#666', fontWeight: 400, marginBottom: '1.8rem', lineHeight: 1.5, marginLeft: 15, marginRight: 10 }}>
                  {blogs[0].description.substring(0, 80)}...</h4>
                <button className="btn-custom" style={{ alignSelf: 'flex-start', marginTop: 'auto' }} onClick={() => setModalBlog(blogs[0])}>Batafsil</button>
              </div>
            </div>
          </div>
        )
      ) : (
        <div
          ref={sliderRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'auto',
            gap: '2.5rem',
            padding: '1rem 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="hide-scrollbar"
        >
          {sliderBlogs.map((blog, idx) => {
            const imageUrl = blog.coverImage
              ? (blog.coverImage.startsWith('http') ? blog.coverImage : backendBaseUrl + blog.coverImage)
              : '/images/s1.jpg';
            // ===== MOBILE VERSION CODE START =====
            // Responsive card width for mobile
            const cardWidth = windowWidth < 768 ? '98vw' : 568;
            // ===== MOBILE VERSION CODE END =====
            return (
              <div
                key={blog._id + '-' + idx}
                style={{
                  minWidth: cardWidth,
                  maxWidth: cardWidth,
                  background: '#fff',
                  borderRadius: '1.2rem',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  border: '1px solid #f3f3f3',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  position: 'relative',
                  height: 492,
                }}
                className="blog-card-custom"
              >
                <img
                  src={imageUrl}
                  alt={blog.title}
                  style={{ width: '100%', height: 295, objectFit: 'cover', borderTopLeftRadius: '1.2rem', borderTopRightRadius: '1.2rem', background: '#f8f8f8' }}
                />
                <div style={{ padding: '2rem 2rem 2.5rem 2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '2.38rem', color: '#f53b57', marginBottom: '1.2rem', fontWeight: 700, lineHeight: 1.2, marginLeft: 15, marginRight: 10 }}>{blog.title}</h2>
                  <h4 style={{ fontSize: '1.74rem', color: '#666', fontWeight: 400, marginBottom: '1.8rem', lineHeight: 1.5, marginLeft: 15, marginRight: 10 }}>{blog.description.substring(0, 80)}...</h4>
                  <button className="btn-custom" style={{ alignSelf: 'flex-start', marginTop: 'auto' }} onClick={() => setModalBlog(blog)}>Batafsil</button>
                </div>
              </div>
            );
          })}
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

export default Home; 