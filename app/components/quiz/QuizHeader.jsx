import { Timer as TimerIcon, Trophy } from "lucide-react";

export default function QuizHeader({ currentQuestionIndex, totalQuestions, timeRemaining, score }) {
  const progressPercentage = ((currentQuestionIndex) / totalQuestions) * 100;
  
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="bg-base-100 border-b border-base-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Progress</span>
            <span className="text-xl font-black text-base-content tabular-nums">
              {String(currentQuestionIndex + 1).padStart(2, '0')} / {totalQuestions}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-3 px-6 py-2 rounded-2xl shadow-inner border transition-colors ${timeRemaining <= 10 ? 'bg-error/10 border-error/20 text-error' : 'bg-base-200 border-base-300 text-primary'}`}>
            <TimerIcon className={`w-5 h-5 ${timeRemaining <= 10 ? 'animate-bounce' : 'animate-pulse'}`} />
            <div className="grid grid-flow-col gap-1 text-center auto-cols-max items-center">
              <span className="countdown font-mono text-2xl font-black">
                <span style={{ "--value": minutes }}></span>
              </span>
              <span className="font-mono text-2xl font-black">:</span>
              <span className="countdown font-mono text-2xl font-black">
                <span style={{ "--value": seconds }}></span>
              </span>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-3 bg-success/10 px-6 py-2 rounded-2xl border border-success/20">
            <Trophy className="w-5 h-5 text-success" />
            <span className="text-xl font-black text-success tabular-nums">{score}</span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar with Pink Gradient */}
      <div className="w-full h-1.5 bg-base-300 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-700 ease-out rounded-r-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
