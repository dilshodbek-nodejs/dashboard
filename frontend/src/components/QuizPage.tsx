import React, { useState, useEffect } from 'react';
import styles from './QuizPage.module.css';

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [points, setPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/tests')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch questions');
        return res.json();
      })
      .then(data => {
        setQuestions(data.map((t: any) => ({ ...t, id: t._id })));
        setSelected(new Array(data.length).fill(null));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
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

  const babyButton = 'w-full py-4 rounded-xl text-lg font-bold border-2 border-pink-300 transition-all duration-150 bg-pink-200 hover:bg-pink-400 hover:text-white';
  const babyButtonActive = 'bg-pink-400 text-white';

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
  const cardColor = 'bg-[#fbeee6]';

  if (loading) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        <div className={styles.quizPageLoadingText}>Loading questions...</div>
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        <div className={styles.quizPageErrorText}>{error}</div>
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        <div className={styles.quizPageNoQuestionsText}>No questions found.</div>
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
      </div>
    );
  }

  const handleOptionClick = (idx: number) => {
    if (selected[current] !== null) return; // Prevent changing answer
    const updated = [...selected];
    updated[current] = idx;
    setSelected(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else if (current === questions.length - 1) {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const handleRestart = () => {
    setSelected(new Array(questions.length).fill(null));
    setCurrent(0);
    setPoints(0);
    setShowResult(false);
  };

  const q = questions[current];
  const correctIdx = q.options.findIndex((opt: any) => opt.isCorrect);

  if (showResult) {
    return (
      <div className={styles.quizPageRoot} style={backgroundStyle}>
        <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
        <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
        <div className={styles.quizPageCard + ' ' + styles.quizPageCardLarge}>
          <div className={styles.quizPageCelebrateIcon}>🎉</div>
          <h2 className={styles.quizPageTitle}>Quiz Complete!</h2>
          <div className={styles.quizPageScore}>You scored {points} out of {questions.length}!</div>
          <button className={styles.quizPageButton} onClick={handleRestart}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizPageRoot} style={backgroundStyle}>
      <img src="/images/about-img.png" alt="Owl" className={styles.quizPageSideImage + ' ' + styles.quizPageOwl} />
      <img src="/images/contact-img.png" alt="Crocodile" className={styles.quizPageSideImage + ' ' + styles.quizPageCrocodile} />
      <div className={styles.quizPageCard + ' ' + styles.quizPageCardLarge}>
        <div className={styles.quizPageCardHeader}>
          <div className={styles.quizPagePoints}>Points: {points}</div>
          <div className={styles.quizPageProgress}>{current + 1} / {questions.length}</div>
        </div>
        <h2 className={styles.quizPageTitle}>Select Correct Option</h2>
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
              onClick={() => handleOptionClick(idx)}
              disabled={selected[current] !== null}
            >
              {opt.text}
            </button>
          ))}
        </div>
        <div className={styles.quizPageCardFooter}>
          <button
            className={styles.quizPageNavButton}
            onClick={handlePrev}
            disabled={current === 0}
          >
            Previous
          </button>
          <button
            className={styles.quizPageNavButton + ' ' + styles.quizPageNavButtonPrimary}
            onClick={handleNext}
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