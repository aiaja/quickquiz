import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Play, Settings2, Info, Loader2, AlertCircle } from "lucide-react";
import { fetchCategories, fetchQuestions } from "~/services/triviaApi";
import { useQuizStore } from "~/stores/quizStore";
import { storage } from "~/utils/localStorage";
import { LS_KEYS } from "~/constants";

export default function SetupForm() {
  const navigate = useNavigate();
  const startQuiz = useQuizStore((state) => state.startQuiz);
  
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form State initialized from LS_KEYS.LAST_CONFIG if exists
  const lastConfig = storage.get(LS_KEYS.LAST_CONFIG) || {};
  const [categoryId, setCategoryId] = useState(lastConfig.categoryId || "");
  const [difficulty, setDifficulty] = useState(lastConfig.difficulty || "");
  const [amount, setAmount] = useState(lastConfig.amount || 10);
  const [type, setType] = useState(lastConfig.type || "");

  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        if (isMounted) {
          // Sort alphabetically for better UX
          setCategories(data.sort((a, b) => a.name.localeCompare(b.name)));
          setIsLoadingCategories(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Gagal memuat kategori. Periksa koneksi internet Anda.");
          setIsLoadingCategories(false);
        }
      }
    };
    loadCategories();
    return () => { isMounted = false; };
  }, []);

  const calculateTimePerQuestion = (diff) => {
    switch (diff) {
      case "hard": return 15;
      case "medium": return 30;
      case "easy": return 45;
      default: return 30; // 'any' difficulty
    }
  };

  const estimatedTime = (amount * calculateTimePerQuestion(difficulty)) / 60;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const params = { amount };
      if (categoryId) params.category = parseInt(categoryId);
      if (difficulty) params.difficulty = difficulty;
      if (type) params.type = type;

      const rawQuestions = await fetchQuestions(params);
      
      if (rawQuestions.length === 0) {
        throw new Error("Tidak ada soal ditemukan untuk kombinasi ini.");
      }

      const selectedCategory = categories.find(c => c.id === parseInt(categoryId));
      
      const config = {
        amount,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        categoryName: selectedCategory ? selectedCategory.name : "Any Category",
        difficulty: difficulty || "any",
        type: type || "any",
        timerPerQuestion: calculateTimePerQuestion(difficulty),
        totalTime: amount * calculateTimePerQuestion(difficulty)
      };

      // Save last config
      storage.set(LS_KEYS.LAST_CONFIG, {
        amount,
        categoryId,
        difficulty,
        type
      });

      startQuiz(config, rawQuestions);
      navigate("/quiz");

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load the quiz. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-300 mx-auto">
      <div className="card-body gap-8">
        <div className="flex items-center gap-3">
          <Settings2 className="w-6 h-6 text-primary" />
          <h2 className="card-title text-2xl font-bold">Setup Quiz</h2>
        </div>

        {error && (
          <div className="alert alert-error text-sm py-2 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kategori */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-bold">Choose Category</span>
            </label>
            <select 
              className="select select-bordered focus:select-primary w-full"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isLoadingCategories}
            >
              <option value="">Any Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Difficulty</span>
            </label>
            <div className="flex bg-base-200 rounded-full p-1 w-full">
  {[
    { label: 'Easy'},
    { label: 'Medium'},
    { label: 'Hard'},
  ].map(({ label }) => (
    <button
      key={label}
      type="button"
      onClick={() => setDifficulty(label.toLowerCase())}
      className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-all
        ${difficulty === label.toLowerCase()
          ? 'bg-base-100 shadow-sm text-primary'
          : 'text-base-content/60 hover:text-base-content'
        }`}
    >
      {label}
    </button>
  ))}
</div>
          </div>

          {/* Amount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Number of Questions</span>
            </label>
            <div className="flex bg-base-200 rounded-full p-1 w-full">
  {[5, 10, 15, 20].map((num) => (
    <button
      key={num}
      type="button"
      onClick={() => setAmount(num)}
      className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-all
        ${amount === num
          ? 'bg-base-100 shadow-sm text-primary'
          : 'text-base-content/60 hover:text-base-content'
        }`}
    >
      {num}
    </button>
  ))}
</div>
          </div>

          {/* Type */}
          <div className="form-control md:col-span-2">
            <label className="label">
              <span className="label-text font-bold">Question Type</span>
            </label>
            <div className="flex gap-4">
              <label className={`label cursor-pointer gap-2 border p-3 rounded-lg flex-1 transition-colors ${type === "" ? "border-primary bg-primary/5" : "border-base-300"}`}>
                <input type="radio" name="type" className="radio radio-primary" checked={type === ""} onChange={() => setType("")} />
                <span className="label-text font-medium">Any Type</span>
              </label>
              <label className={`label cursor-pointer gap-2 border p-3 rounded-lg flex-1 transition-colors ${type === "multiple" ? "border-primary bg-primary/5" : "border-base-300"}`}>
                <input type="radio" name="type" className="radio radio-primary" checked={type === "multiple"} onChange={() => setType("multiple")} />
                <span className="label-text font-medium">Multiple Choice</span>
              </label>
              <label className={`label cursor-pointer gap-2 border p-3 rounded-lg flex-1 transition-colors ${type === "boolean" ? "border-primary bg-primary/5" : "border-base-300"}`}>
                <input type="radio" name="type" className="radio radio-primary" checked={type === "boolean"} onChange={() => setType("boolean")} />
                <span className="label-text font-medium">True / False</span>
              </label>
            </div>
          </div>

          {/* Summary Info */}
          <div className="md:col-span-2 bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-primary/20 p-2 rounded-full">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Quiz Estimate</p>
              <p className="text-xs text-base-content/70">
                {amount} questions &middot; {difficulty || 'Any'} &middot; ~{Math.ceil(estimatedTime)} minutes total duration
              </p>
            </div>
          </div>

          <div className="md:col-span-2 mt-4">
            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-full text-white gap-2 shadow-lg shadow-primary/20"
              disabled={isLoadingCategories || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparing Quiz...
                </>
              ) : (
                <>
                  Start Quiz Now
                  <Play className="w-5 h-5 fill-current" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
