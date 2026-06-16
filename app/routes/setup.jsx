import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "~/components/layout/Header";
import SetupForm from "~/components/quiz/SetupForm";
import ResumeModal from "~/components/quiz/ResumeModal";
import { useAuthStore } from "~/stores/authStore";
import { useQuizStore } from "~/stores/quizStore";

export function meta() {
  return [
    { title: "Quiz Setup | QuickQuiz" },
    { name: "description", content: "Configure your trivia quiz in QuickQuiz." },
  ];
}

export default function Setup() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const quizStatus = useQuizStore((state) => state.status);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const [showResumeModal, setShowResumeModal] = useState(false);

  // Route Protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Check for unfinished quiz
  useEffect(() => {
    if (quizStatus === 'in_progress') {
      setShowResumeModal(true);
    }
  }, [quizStatus]);

  const handleResume = () => {
    setShowResumeModal(false);
    navigate("/quiz");
  };

  const handleNewQuiz = () => {
    resetQuiz();
    setShowResumeModal(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container mx-auto p-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold text-base-content tracking-tight">
              Ready for a <span className="text-primary">Challenge?</span>
            </h1>
            <p className="text-base-content/60 max-w-lg mx-auto font-medium">
              Choose your favorite topic and set the difficulty level to test your knowledge today.
            </p>
          </div>
          
          <SetupForm />
        </div>
      </main>

      {showResumeModal && (
        <ResumeModal 
          onResume={handleResume} 
          onNewQuiz={handleNewQuiz} 
        />
      )}
    </div>
  );
}
