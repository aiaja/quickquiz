import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  RotateCcw,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/stores/authStore";

export default function ResultCard({
  stats,
  config,
  questions,
  answers,
  onNewQuiz,
}) {
  const navigate = useNavigate();
  const { session, logout } = useAuthStore();
  const username = session?.username || "User";

  const handleLogout = () => {
    logout(); 
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 0);
  };

  let badge = "🏆";
  let title = "Luar Biasa!";
  let subtitle = "Status: Legenda Trivia";

  if (stats.percentage < 40) {
    badge = "💪";
    title = "Keep Learning!";
    subtitle = "There is room for improvement. Review your answers below.";
  } else if (stats.percentage < 60) {
    badge = "📚";
    title = "Not Bad!";
    subtitle = "You are making good progress. Review your answers to improve further.";
  } else if (stats.percentage < 80) {
    badge = "👍";
    title = "Good!";
    subtitle = "You have a strong understanding. Review your answers to perfect your score.";
  }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - stats.percentage / 100);

  return (
    <div className="space-y-10 animate-in zoom-in duration-500 pb-12">
      {/* Circular Progress */}
      <div className="flex flex-col items-center gap-6">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            className="text-base-300"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            className="text-primary"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
          />
          <text
            x="100"
            y="114"
            textAnchor="middle"
            fill="currentColor"
            className="text-base-content"
          >
            <tspan fontSize="50" fontWeight="900">
              {stats.percentage}
            </tspan>
            <tspan fontSize="18" fontWeight="700" dy="-20" dx="2">
              %
            </tspan>
          </text>
        </svg>
        <div className="text-center">
          <h2 className="text-2xl font-black text-base-content">{title}</h2>
          <p className="text-base-content/60 text-sm mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "CORRECT",
            value: stats.correct,
            icon: CheckCircle2,
            color: "text-success",
            bg: "bg-success/10",
          },
          {
            label: "WRONG",
            value: stats.wrong,
            icon: XCircle,
            color: "text-error",
            bg: "bg-error/10",
          },
          {
            label: "SKIPPED",
            value: stats.unanswered,
            icon: MinusCircle,
            color: "text-base-content/30",
            bg: "bg-base-content/10",
          },
          {
            label: "TIME TAKEN",
            value: stats.duration,
            icon: Clock,
            color: "text-primary",
            bg: "bg-primary/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`border border-base-300 rounded-xl p-5 text-center shadow-sm ${stat.bg}`}
          >
            <div className="">
              <stat.icon className={`w-5 h-5 mx-auto mb-3 ${stat.color}`} />
            </div>
            <div className="text-3xl font-black tabular-nums text-base-content">
              {stat.value}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onNewQuiz}
          className="btn btn-primary px-8 gap-2 rounded-full shadow-md text-white group"
        >
          <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
          <span className="font-black">NEW QUIZ</span>
        </button>
        <button
          onClick={handleLogout}
          className="btn btn-outline border-primary px-8 gap-2 rounded-full border-2 hover:bg-base-200"
        >
          <LogOut className="w-4 h-4 text-primary" />
          <span className="font-black text-primary">LOGOUT</span>
        </button>
      </div>

      {/* Question Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-black text-base-content whitespace-nowrap">
            QUESTION BREAKDOWN
          </h3>
          <div className="flex-1 h-px bg-base-300" />
        </div>

        <div className="space-y-3">
          {questions.map((q, index) => {
            const answerRecord = answers.find((a) => a.questionIndex === index);
            const isCorrect = answerRecord?.isCorrect;
            const isUnanswered =
              !answerRecord || answerRecord.selectedAnswer === null;

            const borderColor = isUnanswered
              ? "border-l-base-300"
              : isCorrect
                ? "border-l-success"
                : "border-l-error";
            const labelColor = isUnanswered
              ? "text-base-content/40"
              : isCorrect
                ? "text-success"
                : "text-error";

            return (
              <div
                key={q.id}
                className={`bg-base-100 border border-base-300 border-l-6 ${borderColor} rounded-xl p-5 space-y-3 shadow-sm`}
              >
                <div
                  className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}
                >
                  Question {index + 1}
                </div>
                <p
                  className="text-sm font-semibold text-base-content leading-snug"
                  dangerouslySetInnerHTML={{ __html: q.question }}
                />
                <div className="space-y-1.5">
                  {!isUnanswered && !isCorrect && (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-error flex-shrink-0" />
                      <span
                        className="text-sm text-error/70"
                        dangerouslySetInnerHTML={{
                          __html: answerRecord.selectedAnswer,
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    <span
                      className={`text-sm font-bold ${isCorrect && !isUnanswered ? "text-success" : "text-base-content"}`}
                      dangerouslySetInnerHTML={{
                        __html:
                          isCorrect && !isUnanswered
                            ? answerRecord.selectedAnswer
                            : q.correctAnswer,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
