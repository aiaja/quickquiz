import { CheckCircle2, XCircle, MousePointer2 } from "lucide-react";

export default function QuizFooter({ answered, correct, wrong }) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-300 py-4 shadow-2xl z-40">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex w-full justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-base-content/40 sm:inline">ANSWERED</span>
            <span className="badge badge-ghost font-mono font-bold">{answered}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-success sm:inline">CORRECT</span>
            <span className="badge badge-success text-white font-mono font-bold">{correct}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-error sm:inline">WRONG</span>
            <span className="badge badge-error text-white font-mono font-bold">{wrong}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
