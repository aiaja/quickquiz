import { useEffect } from "react";
import { useNavigate } from "react-router";
import LoginForm from "../components/auth/LoginForm";
import { useAuthStore } from "~/stores/authStore";

export function meta() {
  return [
    { title: "Login | QuickQuiz" },
    { name: "description", content: "Masuk ke QuickQuiz untuk mulai kuis trivia!" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Redirect to setup if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/setup", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <LoginForm />
      
      <footer className="mt-8 text-xs text-base-content/40">
        © 2026 QuickQuiz App • Engineering Internal
      </footer>
    </main>
  );
}
