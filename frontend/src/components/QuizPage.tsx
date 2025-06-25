import React, { useState, useEffect } from 'react';

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
    fetch('http://localhost:4000/api/tests')
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
      <div style={backgroundStyle}>
        <div className="text-2xl text-pink-400 font-bold animate-pulse">Loading questions...</div>
        <img src="/images/owl-leftside.png" alt="Owl" className="hidden md:block absolute left-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
        <img src="/images/crocodile-right-side.png" alt="Crocodile" className="hidden md:block absolute right-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={backgroundStyle}>
        <div className="text-2xl text-red-400 font-bold">{error}</div>
        <img src="/images/owl-leftside.png" alt="Owl" className="hidden md:block absolute left-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
        <img src="/images/crocodile-right-side.png" alt="Crocodile" className="hidden md:block absolute right-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div style={backgroundStyle}>
        <div className="text-2xl text-pink-400 font-bold">No questions found.</div>
        <img src="/images/owl-leftside.png" alt="Owl" className="hidden md:block absolute left-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
        <img src="/images/crocodile-right-side.png" alt="Crocodile" className="hidden md:block absolute right-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
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
      <div style={backgroundStyle}>
        <img src="/images/owl-leftside.png" alt="Owl" className="hidden md:block absolute left-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
        <img src="/images/crocodile-right-side.png" alt="Crocodile" className="hidden md:block absolute right-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
        <div className={`w-full max-w-xl rounded-3xl shadow-lg p-8 mt-4 ${cardColor} border-4 border-pink-300 flex flex-col items-center`} style={{zIndex: 2, position: 'relative'}}>
          <div className="text-5xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-extrabold text-center mb-2 text-pink-500">Quiz Complete!</h2>
          <div className="text-xl text-center mb-4 text-gray-700 font-bold">You scored {points} out of {questions.length}!</div>
          <button
            className="px-8 py-3 rounded-lg border-2 border-pink-300 bg-pink-400 text-white font-bold text-lg mt-4 hover:bg-pink-500 transition"
            onClick={handleRestart}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <img src="/images/owl-leftside.png" alt="Owl" className="hidden md:block absolute left-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
      <img src="/images/crocodile-right-side.png" alt="Crocodile" className="hidden md:block absolute right-0 bottom-0 w-40 md:w-60 lg:w-72" style={{zIndex: 1}} />
      <div className={`w-full max-w-xl rounded-3xl shadow-lg p-8 mt-4 ${cardColor} border-4 border-pink-300`} style={{zIndex: 2, position: 'relative'}}>
        <div className="flex justify-between mb-4">
          <div className="text-lg font-bold text-pink-600">Points: {points}</div>
          <div className="text-pink-400 font-bold">{current + 1} / {questions.length}</div>
        </div>
        <h2 className="text-3xl font-extrabold text-center mb-2 text-pink-500">Select Correct Option</h2>
        <div className="text-xl text-center mb-8 text-gray-700">{q.question}</div>
        <div className="flex flex-col gap-4 mb-8">
          {q.options.map((opt: any, idx: number) => (
            <button
              key={idx}
              className={`${babyButton} ${selected[current] === idx ? babyButtonActive : ''} ${selected[current] !== null && idx === correctIdx && opt.isCorrect ? 'ring-4 ring-green-300' : ''} ${selected[current] !== null && selected[current] === idx && idx !== correctIdx ? 'ring-4 ring-red-300' : ''}`}
              onClick={() => handleOptionClick(idx)}
              disabled={selected[current] !== null}
            >
              {opt.text}
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            className="px-6 py-2 rounded-lg border-2 border-pink-300 bg-white text-pink-500 font-bold text-lg disabled:opacity-50"
            onClick={handlePrev}
            disabled={current === 0}
          >
            Previous
          </button>
          <button
            className="px-6 py-2 rounded-lg border-2 border-pink-300 bg-pink-400 text-white font-bold text-lg disabled:opacity-50"
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