import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import QuizHeader from "~/components/quiz/QuizHeader";
import QuestionCard from "~/components/quiz/QuestionCard";
import QuizFooter from "~/components/quiz/QuizFooter";
import { useAuthStore } from "~/stores/authStore";
import { useQuizStore } from "~/stores/quizStore";
import { useTimer } from "~/hooks/useTimer";
import { calculateScore } from "~/utils/quizHelpers";

export function meta() {
  return [
    { title: "Quiz Gameplay | QuickQuiz" },
  ];
}

export default function Quiz() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { 
    status, 
    config, 
    questions, 
    currentQuestionIndex, 
    answers,
    submitAnswer,
    nextQuestion,
    finishQuiz,
    timeRemaining: storeTimeRemaining,
    updateTimeRemaining
  } = useQuizStore();

  // Route Protection & State Validation
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (status === 'idle' || !config || questions.length === 0) {
      navigate("/setup", { replace: true });
    } else if (status === 'finished') {
      navigate("/results", { replace: true });
    }
  }, [isAuthenticated, status, config, questions.length, navigate]);

  const handleTimerExpire = () => {
    // If timer expires, record null for remaining questions and finish
    finishQuiz(0);
  };

  const { timeRemaining } = useTimer({
    initialSeconds: storeTimeRemaining || (config?.totalTime || 0),
    onExpire: handleTimerExpire,
    isActive: status === 'in_progress',
  });

  // Sync time to store to ensure accurate resume if browser is closed
  // We sync every 5 seconds to avoid excessive localStorage writes while maintaining accuracy
  useEffect(() => {
    if (status !== 'in_progress') return;

    const syncInterval = setInterval(() => {
      updateTimeRemaining(timeRemaining);
    }, 5000);

    const handleBeforeUnload = () => {
      updateTimeRemaining(timeRemaining);
    };
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateTimeRemaining(timeRemaining);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timeRemaining, status, updateTimeRemaining]);

  const handleAnswer = (selectedAnswer) => {
    submitAnswer(selectedAnswer);
    
    // Auto-advance logic
    const hasNext = nextQuestion();
    if (!hasNext) {
      finishQuiz(timeRemaining);
    }
  };

  // Calculate live stats for header and footer
  const stats = useMemo(() => {
    if (!questions.length) return { correct: 0, wrong: 0, answered: 0, score: 0 };
    
    // We only pass the answered array up to the current index to calculateScore
    const currentAnswers = answers.filter(a => a !== undefined).map(a => a.selectedAnswer);
    const calculated = calculateScore(currentAnswers, questions, config?.totalTime || 0, timeRemaining);
    
    return {
      correct: calculated.correct,
      wrong: calculated.wrong,
      answered: currentAnswers.length,
      score: calculated.correct * 10 // Arbitrary live score calculation (10 pts per correct)
    };
  }, [answers, questions, config?.totalTime, timeRemaining]);

  if (status !== 'in_progress' || !config || questions.length === 0) {
    return null; // Will redirect via useEffect
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-base-200 pb-24 flex flex-col">
      <QuizHeader 
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={config.amount}
        timeRemaining={timeRemaining}
        score={stats.score}
      />
      
      <main className="container mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto w-full">
          <QuestionCard 
            question={currentQuestion} 
            onAnswer={handleAnswer} 
          />
        </div>
      </main>

      <QuizFooter 
        answered={stats.answered}
        correct={stats.correct}
        wrong={stats.wrong}
      />
    </div>
  );
}
