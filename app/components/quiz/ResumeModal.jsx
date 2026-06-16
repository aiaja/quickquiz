import { AlertTriangle, Play, RotateCcw } from "lucide-react";

export default function ResumeModal({ onResume, onNewQuiz }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100 border border-primary/20 shadow-2xl rounded-3xl max-w-md">
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="bg-warning/20 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-warning" />
          </div>
          
          <div>
            <h3 className="font-black text-2xl text-base-content">Kuis Belum Selesai!</h3>
            <p className="py-4 text-base-content/70 font-medium">
              Kami menemukan sesi kuis yang belum Anda selesaikan sebelumnya. 
              Apakah Anda ingin melanjutkannya atau memulai kuis baru?
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 mt-2">
            <button 
              onClick={onResume}
              className="btn btn-primary btn-lg w-full text-white font-black gap-2 shadow-lg shadow-primary/20"
            >
              <Play className="w-5 h-5 fill-current" />
              Lanjutkan Kuis
            </button>
            <button 
              onClick={onNewQuiz}
              className="btn btn-outline btn-lg w-full font-black gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Mulai Kuis Baru
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-base-300/80 backdrop-blur-sm"></div>
    </div>
  );
}
