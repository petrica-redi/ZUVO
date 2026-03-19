"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, GraduationCap } from "lucide-react";
import { QUIZZES, type Quiz } from "@/data/quizzes";

export function HealthQuiz() {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (activeQuiz && index === activeQuiz.questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    if (currentQ + 1 >= activeQuiz.questions.length) {
      setShowResult(true);
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  const retryQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setShowResult(false);
    setAnswered(false);
  };

  if (activeQuiz && showResult) {
    const total = activeQuiz.questions.length;
    const pct = Math.round((score / total) * 100);
    const emoji = pct === 100 ? "🏆" : pct >= 75 ? "🎉" : pct >= 50 ? "👍" : "📚";
    const message = pct === 100 ? "Perfect score!" : pct >= 75 ? "Great job!" : pct >= 50 ? "Good effort!" : "Keep learning!";

    return (
      <div className="text-center animate-scale-in">
        <span className="text-6xl">{emoji}</span>
        <h2 className="mt-4 text-[22px] font-black text-gray-900">{message}</h2>
        <p className="mt-2 text-[15px] text-gray-500">
          You got <span className="font-black text-[#C0392B]">{score}</span> out of <span className="font-black">{total}</span> correct
        </p>

        <div className="mx-auto mt-4 h-3 w-48 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 75 ? "#16A34A" : pct >= 50 ? "#F59E0B" : "#EF4444" }} />
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={retryQuiz} className="flex flex-1 h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white text-[14px] font-bold text-gray-700 active:scale-[0.97]">
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
          <button onClick={resetQuiz} className="flex flex-1 h-[48px] items-center justify-center gap-2 rounded-2xl text-[14px] font-bold text-white active:scale-[0.97]" style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)" }}>
            <Trophy className="h-4 w-4" /> More quizzes
          </button>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const q = activeQuiz.questions[currentQ];
    const total = activeQuiz.questions.length;

    return (
      <div>
        <button onClick={resetQuiz} className="mb-4 flex items-center gap-1 text-[13px] font-semibold text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Back to quizzes
        </button>

        {/* Progress */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-[#C0392B] transition-all" style={{ width: `${((currentQ + 1) / total) * 100}%` }} />
          </div>
          <span className="text-[12px] font-bold text-gray-400">{currentQ + 1}/{total}</span>
        </div>

        {/* Question */}
        <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm animate-fade-in-up" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
          <p className="text-[16px] font-bold leading-snug text-gray-900">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((option, i) => {
            let style = "border-gray-100 bg-white text-gray-800";
            let icon = null;

            if (answered) {
              if (i === q.correctIndex) {
                style = "border-green-300 bg-green-50 text-green-800";
                icon = <CheckCircle2 className="h-5 w-5 text-green-500" />;
              } else if (i === selected && i !== q.correctIndex) {
                style = "border-red-300 bg-red-50 text-red-800";
                icon = <XCircle className="h-5 w-5 text-red-500" />;
              } else {
                style = "border-gray-100 bg-gray-50 text-gray-400";
              }
            } else if (i === selected) {
              style = "border-[#C0392B] bg-red-50 text-[#C0392B]";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left text-[14px] font-semibold transition-all active:scale-[0.98] ${style}`}
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-[13px] font-black text-gray-500">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 animate-fade-in-up">
            <p className="text-[13px] leading-relaxed text-blue-800">{q.explanation}</p>
          </div>
        )}

        {answered && (
          <button
            onClick={nextQuestion}
            className="mt-4 flex w-full h-[48px] items-center justify-center rounded-2xl text-[14px] font-bold text-white active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)" }}
          >
            {currentQ + 1 >= total ? "See results" : "Next question"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/25">
          <GraduationCap className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-[22px] font-black text-gray-900">Health Quiz</h1>
        <p className="mt-2 text-[13px] text-gray-500">
          Test your knowledge. Learn something new.
        </p>
      </div>

      <div className="space-y-3">
        {QUIZZES.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => setActiveQuiz(quiz)}
            className="card-hover flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"
            style={{ border: "1px solid rgba(0,0,0,0.04)" }}
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${quiz.gradient} shadow-md`}>
              <span className="text-2xl">{quiz.emoji}</span>
            </div>
            <div className="flex-1">
              <span className="text-[15px] font-bold text-gray-900">{quiz.title}</span>
              <p className="text-[12px] text-gray-500">{quiz.description}</p>
              <p className="text-[11px] font-semibold text-gray-400">{quiz.questions.length} questions</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
