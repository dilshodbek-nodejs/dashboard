import React, { useEffect, useState } from 'react';
import { Test } from '../types';

const baseUri = 'http://15.235.141.2:4000/api';

const babyColors = {
  bg: 'bg-pink-50',
  card: 'bg-white',
  primary: 'bg-pink-400',
  primaryText: 'text-pink-600',
  button: 'bg-pink-200',
  buttonActive: 'bg-pink-400 text-white',
  border: 'border-pink-300',
};

export const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Test[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [points, setPoints] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${baseUri}/tests`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch questions');
        return res.json();
      })
      .then(data => {
        setQuestions(data.map((t: any) => ({ ...t, id: t._id })));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleOptionClick = (idx: number) => {
    if (answered || !questions.length) return;
    setSelected(idx);
    setAnswered(true);
    if (questions[current].options[idx].isCorrect) {
      setPoints(points + 1);
    }
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${babyColors.bg}`}>
        <div className="text-2xl text-pink-400 font-bold animate-pulse">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${babyColors.bg}`}>
        <div className="text-2xl text-red-400 font-bold">{error}</div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${babyColors.bg}`}>
        <div className="text-2xl text-pink-400 font-bold">No questions found.</div>
      </div>
    );
  }

  // Find the correct answer index for highlight
  const correctIdx = questions[current].options.findIndex(opt => opt.isCorrect);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${babyColors.bg} font-[Comic Sans MS, Comic Sans, cursive]`}>
      {/* Navigation bar (optional) */}
      <nav className="w-full flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧒👧</span>
          <span className="font-bold text-lg">Quiz Time!</span>
        </div>
        <div className="text-lg font-bold text-pink-600">Points: {points}</div>
      </nav>
      <div className={`w-full max-w-xl rounded-3xl shadow-lg p-8 mt-4 ${babyColors.card} border-4 ${babyColors.border}`}>        
        <h2 className="text-3xl font-extrabold text-center mb-2 text-pink-500" style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive' }}>Select Correct Option</h2>
        <div className="text-xl text-center mb-8 text-gray-700">{questions[current].question}</div>
        <div className="flex flex-col gap-4 mb-8">
          {questions[current].options.map((opt, idx) => (
            <button
              key={idx}
              className={`w-full py-4 rounded-xl text-lg font-bold border-2 ${babyColors.border} transition-all duration-150
                ${selected === idx ? babyColors.buttonActive : babyColors.button}
                ${answered && idx === correctIdx ? 'ring-4 ring-green-300' : ''}
                ${answered && selected === idx && idx !== correctIdx ? 'ring-4 ring-red-300' : ''}
              `}
              onClick={() => handleOptionClick(idx)}
              disabled={answered}
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
            Previous Question
          </button>
          <button
            className="px-6 py-2 rounded-lg border-2 border-pink-300 bg-pink-400 text-white font-bold text-lg disabled:opacity-50"
            onClick={handleNext}
            disabled={current === questions.length - 1}
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 