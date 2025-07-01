import React, { useState, useEffect } from 'react';
import styles from './QuizPage.module.css';
import { Test, TestTopic } from '../types';
import { useNavigate } from 'react-router-dom';

const QuizPage: React.FC = () => {
  const [topics, setTopics] = useState<TestTopic[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TestTopic | null>(null);
  const [questions, setQuestions] = useState<Test[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [points, setPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/tests/topics').then(res => res.json()),
      fetch('/api/tests').then(res => res.json())
    ])
      .then(([topicsData, testsData]) => {
        setTopics(topicsData.map((t: any) => ({
          id: t._id,
          title: t.title,
          description: t.description,
          createdAt: t.createdAt
        })));
        setTests(testsData.map((t: any) => ({
          id: t._id,
          question: t.question,
          options: t.options,
          createdAt: t.createdAt,
          topic: t.topic
        })));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Recalculate points whenever selected changes
    let pts = 0;
    questions.forEach((q, idx) => {
      if (selected[idx] !== null && q.options[selected[idx]]?.isCorrect) {
        pts++;
      }
    });
    setPoints(pts);
  }, [selected, questions]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const backgroundStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundImage: "url('/images/background.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: 'Comic Sans MS, Comic Sans, cursive',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  };

  // Button classes for mobile
  const mobileButtonClass = `fixed left-2 w-[90vw] max-w-xs font-bold z-30 bg-pink-100 text-pink-600 rounded-full shadow-lg hover:bg-pink-200 transition-all
    ${scrolled ? 'top-2 py-3 text-lg border-2' : 'top-[10vh] py-5 text-2xl border-4'}
    sm:top-4 sm:left-4 sm:w-auto sm:px-10 sm:py-5 sm:text-2xl sm:border-4 px-5`;

  if (loading) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        {/* Only show on loading screen if not in quiz */}
        {!selectedTopic && (
          <button className={mobileButtonClass} onClick={() => navigate('/main')}>
            Bosh menyuga qaytish
          </button>
        )}
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
        <div className={styles.quizPageLoadingText}>Yuklanmoqda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        {/* Only show on error screen if not in quiz */}
        {!selectedTopic && (
          <button className={mobileButtonClass} onClick={() => navigate('/main')}>
            Bosh menyuga qaytish
          </button>
        )}
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
        <div className={styles.quizPageErrorText}>Ma'lumotlarni yuklab bo'lmadi</div>
      </div>
    );
  }

  // Show test packs (topics) grid if no topic selected
  if (!selectedTopic) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        <button className={mobileButtonClass} onClick={() => navigate('/main')}>
          Bosh menyuga qaytish
        </button>
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
        <h2 className="text-3xl font-bold text-pink-600 mb-8" style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive' }}>Test to'plamini tanlang</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl px-2 justify-center place-content-center relative">
          {/* Side images behind cards */}
          <img src="/images/about-img.png" alt="Owl" className="hidden sm:block absolute left-0 bottom-0 w-32 sm:w-40 md:w-56 opacity-30 z-0 pointer-events-none select-none" />
          <img src="/images/contact-img.png" alt="Crocodile" className="hidden sm:block absolute right-0 top-0 w-32 sm:w-40 md:w-56 opacity-30 z-0 pointer-events-none select-none" />
          {topics.map((topic, idx) => {
            const bgImg = `/images/card-bg${(idx % 3) + 1}.png`;
            return (
              <div
                key={topic.id}
                className="relative rounded-3xl shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform border-4 border-pink-200 overflow-hidden w-full min-h-[220px] sm:min-h-[350px] mx-auto z-10"
                style={{ minHeight: window.innerWidth < 640 ? 220 : 350, background: `url(${bgImg}) center/cover, #fff0f6`, maxWidth: window.innerWidth >= 1280 ? '900px' : window.innerWidth < 640 ? '300px' : '700px', width: '100%' }}
                onClick={() => {
                  setSelectedTopic(topic);
                  const filtered = tests.filter(t => t.topic === topic.id);
                  setQuestions(filtered);
                  setSelected(new Array(filtered.length).fill(null));
                  setCurrent(0);
                  setPoints(0);
                  setShowResult(false);
                }}
              >
                <h3 className="text-4xl lg:text-5xl font-bold text-pink-600 mb-6 text-center drop-shadow-lg z-10">{topic.title}</h3>
                <p className="text-gray-700 text-center text-2xl lg:text-3xl z-10 drop-shadow">{topic.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // If no quizzes in selected pack
  if (selectedTopic && questions.length === 0) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        <button className={mobileButtonClass} onClick={() => navigate('/main')}>
          Bosh menyuga qaytish
        </button>
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
        <button className="absolute top-8 left-8 bg-pink-100 text-pink-600 rounded-full px-8 py-4 text-2xl font-bold shadow-lg hover:bg-pink-200 transition-all z-20" onClick={() => setSelectedTopic(null)}>
          ← Test to'plamlariga qaytish
        </button>
        <div className="text-2xl font-bold text-pink-600 mb-4">Bu test to'plamida savollar topilmadi.</div>
      </div>
    );
  }

  // Quiz logic (same as before, but with back button)
  const q = questions[current];
  const correctIdx = q.options.findIndex((opt: any) => opt.isCorrect);

  if (showResult) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
        <div className={styles.quizPageCard + ' ' + styles.quizPageCardLarge}>
          <div className={styles.quizPageCelebrateIcon}>🎉</div>
          <h2 className={styles.quizPageTitle}>Test yakunlandi!</h2>
          <div className={styles.quizPageScore}>Siz {questions.length} savoldan {points} tasiga to'g'ri javob berdingiz!</div>
          <button className={styles.quizPageButton} onClick={() => setSelectedTopic(null)}>Test to'plamlariga qaytish</button>
        </div>
      </div>
    );
  }

  // Show 'Stop quiz and go to quiz packs' button only during quiz
  const stopQuizButton = (
    <button
      className={mobileButtonClass}
      onClick={() => {
        setSelectedTopic(null);
        setQuestions([]);
        setSelected([]);
        setCurrent(0);
        setPoints(0);
        setShowResult(false);
        // Do NOT navigate to /main
      }}
      style={{ zIndex: 30 }}
    >
      Testni to'xtatib, test to'plamlariga qaytish
    </button>
  );

  return (
    <div className={styles.quizPageRoot} style={backgroundStyle}>
      {/* Show stop quiz button only during quiz */}
      {stopQuizButton}
      <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
      <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
      <div className={styles.quizPageCard + ' ' + styles.quizPageCardLarge}>
        <div className={styles.quizPageCardHeader}>
          <div className={styles.quizPagePoints}>Ball: {points}</div>
          <div className={styles.quizPageProgress}>{current + 1} / {questions.length}</div>
        </div>
        <h2 className={styles.quizPageTitle}>To'g'ri javobni tanlang</h2>
        <div className={styles.quizPageQuestion}>{q.question}</div>
        <div className={styles.quizPageOptions}>
          {q.options.map((opt: any, idx: number) => (
            <button
              key={idx}
              className={
                styles.quizPageOptionButton +
                (selected[current] === idx ? ' ' + styles.quizPageOptionActive : '') +
                (selected[current] !== null && idx === correctIdx && opt.isCorrect ? ' ' + styles.quizPageOptionCorrect : '') +
                (selected[current] !== null && selected[current] === idx && idx !== correctIdx ? ' ' + styles.quizPageOptionWrong : '')
              }
              onClick={() => {
                if (selected[current] !== null) return;
                const updated = [...selected];
                updated[current] = idx;
                setSelected(updated);
              }}
              disabled={selected[current] !== null}
            >
              {opt.text}
            </button>
          ))}
        </div>
        <div className={styles.quizPageCardFooter}>
          <button
            className={styles.quizPageNavButton}
            onClick={() => setCurrent(current - 1)}
            disabled={current === 0}
          >
            Previous
          </button>
          <button
            className={styles.quizPageNavButton + ' ' + styles.quizPageNavButtonPrimary}
            onClick={() => {
              if (current < questions.length - 1) {
                setCurrent(current + 1);
              } else if (current === questions.length - 1) {
                setShowResult(true);
              }
            }}
            disabled={selected[current] === null}
          >
            {current === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage; 