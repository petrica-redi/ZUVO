export type QuizQuestion = {
  correctIndex: number;
};

export type Quiz = {
  id: string;
  emoji: string;
  gradient: string;
  questions: QuizQuestion[];
};

export const QUIZZES: Quiz[] = [
  {
    id: "antibiotics",
    emoji: "💊",
    gradient: "from-blue-500 to-indigo-600",
    questions: [
      { correctIndex: 1 },
      { correctIndex: 1 },
      { correctIndex: 1 },
      { correctIndex: 2 },
    ],
  },
  {
    id: "vaccines",
    emoji: "💉",
    gradient: "from-emerald-500 to-green-600",
    questions: [
      { correctIndex: 1 },
      { correctIndex: 1 },
      { correctIndex: 1 },
      { correctIndex: 1 },
    ],
  },
  {
    id: "diabetes",
    emoji: "🩸",
    gradient: "from-amber-500 to-orange-600",
    questions: [
      { correctIndex: 1 },
      { correctIndex: 1 },
      { correctIndex: 1 },
      { correctIndex: 1 },
    ],
  },
  {
    id: "hygiene",
    emoji: "🧼",
    gradient: "from-cyan-500 to-blue-600",
    questions: [
      { correctIndex: 1 },
      { correctIndex: 1 },
      { correctIndex: 1 },
      { correctIndex: 1 },
    ],
  },
];
