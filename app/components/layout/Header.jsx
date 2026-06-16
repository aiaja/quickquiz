import { BrainCircuit, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "~/stores/authStore";

export default function Header() {
  const navigate = useNavigate();
  const { session, logout } = useAuthStore();
  const username = session?.username || "User";

  const handleLogout = () => {
    logout(); 
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 0);
  };

  return (
    <header className="navbar bg-base-100 shadow-sm border-b border-base-300 px-4 md:px-8 sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/setup" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-12 h-12" />
          <span className="text-xl font-bold tracking-tight text-base-content hidden sm:inline-block">
            QuickQuiz
          </span>
        </Link>
      </div>

      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
          >
            <li className="menu-title px-4 py-2 opacity-60 flex flex-col items-start gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Active User
              </span>
              <span className="text-sm font-bold text-base-content capitalize">
                {username}
              </span>
            </li>
            <div className="divider my-0"></div>
            <li>
              <button
                onClick={handleLogout}
                className="text-error flex items-center gap-2 font-bold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
