import { useState, useEffect } from "react";

export default function QuestionCard({ question, onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsRevealed(false);
  }, [question.id]);

  const handleSelect = (answer) => {
    if (isRevealed) return; 
    
    setSelectedAnswer(answer);
    setIsRevealed(true);
    setTimeout(() => {
      onAnswer(answer);
    }, 2000);
  };

  const getButtonClass = (answer) => {
    if (!isRevealed) {
      return selectedAnswer === answer 
        ? "btn-primary text-white border-primary" 
        : "btn-outline border-2 hover:bg-primary/5 hover:border-primary";
    }

    if (answer === question.correctAnswer) {
      return "bg-success text-white border-success hover:bg-success";
    }
    
    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return "bg-error text-white border-error hover:bg-error";
    }

    return "btn-outline border-2 opacity-50";
  };

  const getBadgeClass = (answer) => {
    if (!isRevealed) {
      return "bg-base-200 group-hover:bg-primary group-hover:text-white";
    }
    if (answer === question.correctAnswer) return "bg-white/20 text-white";
    if (selectedAnswer === answer) return "bg-white/20 text-white";
    return "bg-base-200";
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div key={question.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
        <div className="p-1 bg-primary"></div>
        <div className="card-body py-10">
          <div className="badge badge-primary badge-outline font-bold mb-2 uppercase tracking-wider">
            {question.category}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-base-content leading-tight" dangerouslySetInnerHTML={{ __html: question.question }} />
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-4 ${question.type === 'boolean' ? '' : 'md:grid-cols-2'}`}>
        {question.shuffledAnswers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleSelect(answer)}
            disabled={isRevealed}
            className={`group btn btn-lg h-auto py-6 justify-start gap-4 transition-all duration-200 ${getButtonClass(answer)}`}
          >
            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${getBadgeClass(answer)}`}>
              {optionLabels[index] || '-'}
            </span>
            <span className="text-lg font-medium text-left flex-1" dangerouslySetInnerHTML={{ __html: answer }} />
          </button>
        ))}
      </div>
    </div>
  );
}
