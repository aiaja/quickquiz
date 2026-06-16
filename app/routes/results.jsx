import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import Header from "~/components/layout/Header";
import ResultCard from "~/components/quiz/ResultCard";
import { useAuthStore } from "~/stores/authStore";
import { useQuizStore } from "~/stores/quizStore";
import { calculateScore } from "~/utils/quizHelpers";

export function meta() {
  return [{ title: "Quiz Results | QuickQuiz" }];
}

export default function Results() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const { status, config, questions, answers, timeRemaining, resetQuiz } =
    useQuizStore();

  // Route Protection & State Validation
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // User shouldn't be here if quiz isn't finished
    if (status !== "finished" || !config || questions.length === 0) {
      navigate("/setup", { replace: true });
    }
  }, [isAuthenticated, status, config, questions.length, navigate]);

  const stats = useMemo(() => {
    if (!config || questions.length === 0) return null;

    // Extract answers array
    const answerStrings = Array(questions.length).fill(null);
    answers.forEach((a) => {
      answerStrings[a.questionIndex] = a.selectedAnswer;
    });

    return calculateScore(
      answerStrings,
      questions,
      config.totalTime,
      timeRemaining,
    );
  }, [answers, questions, config, timeRemaining]);

  const handleNewQuiz = () => {
    resetQuiz();
    navigate("/setup");
  };

  const handleLogout = () => {
    resetQuiz();
    logout();
    navigate("/", { replace: true });
  };

  if (status !== "finished" || !config || !stats) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-black text-base-content tracking-tight uppercase">
              QUIZ RESULTS
            </h1>
            <p className="text-base-content/60 text-sm">
              You have completed the quiz. Here is a summary of your performance.
            </p>
            <div className="badge badge-primary badge-outline badge-lg font-bold tracking-widest uppercase p-4">
              {config.categoryName} &middot; {config.difficulty}
            </div>
          </div>

          <ResultCard
            stats={stats}
            config={config}
            questions={questions}
            answers={answers}
            onNewQuiz={handleNewQuiz}
            onLogout={handleLogout}
          />
        </div>
      </main>
    </div>
  );
}
