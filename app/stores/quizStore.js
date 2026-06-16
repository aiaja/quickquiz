import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { LS_KEYS } from "~/constants";
import { htmlDecode, shuffle } from "~/utils/quizHelpers";

export const useQuizStore = create()(
  persist(
    (set, get) => ({
      quizId: null,
      status: "idle",
      config: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 0,
      startedAt: null,

      startQuiz: (config, rawQuestions) => {
        const questions = rawQuestions.map((q, index) => {
          const decodedCorrect = htmlDecode(q.correct_answer);
          const decodedIncorrect = q.incorrect_answers.map(htmlDecode);
          return {
            id: index,
            question: htmlDecode(q.question),
            category: htmlDecode(q.category),
            correctAnswer: decodedCorrect,
            incorrectAnswers: decodedIncorrect,
            shuffledAnswers: shuffle([decodedCorrect, ...decodedIncorrect]),
          };
        });

        set({
          quizId: `qz_${nanoid(8)}`,
          status: "in_progress",
          config,
          questions,
          currentQuestionIndex: 0,
          answers: [],
          timeRemaining: config.totalTime,
          startedAt: new Date().toISOString(),
        });
      },

      submitAnswer: (answer) => {
        const { currentQuestionIndex, questions, answers } = get();
        const question = questions[currentQuestionIndex];
        const isCorrect = answer === question.correctAnswer;
        const newAnswer = {
          questionIndex: currentQuestionIndex,
          selectedAnswer: answer,
          isCorrect,
        };

        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = newAnswer;

        set({ answers: newAnswers });
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
          return true;
        }
        return false;
      },

      finishQuiz: (finalTimeRemaining = 0) => {
        set({ status: 'finished', timeRemaining: finalTimeRemaining });
      },

      updateTimeRemaining: (time) => {
        set({ timeRemaining: time });
      },

      resetQuiz: () => {
        set({
          quizId: null,
          status: "idle",
          config: null,
          questions: [],
          currentQuestionIndex: 0,
          answers: [],
          timeRemaining: 0,
          startedAt: null,
        });
      },

      resumeQuiz: (savedState) => {
        set({ ...savedState, status: "in_progress" });
      },
    }),
    {
      name: LS_KEYS.QUIZ_STATE,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        quizId: state.quizId,
        status: state.status,
        config: state.config,
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        timeRemaining: state.timeRemaining,
        startedAt: state.startedAt,
      }),
    },
  ),
);
