import { useState } from "react";
import { useNavigate } from "react-router";
import { LogIn, AlertCircle, Info } from "lucide-react";
import { useAuthStore } from "~/stores/authStore";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const result = login(username, password);
    if (result.success) {
      navigate("/setup");
    } else {
      setError(result.error || "An error occurred while logging in");
    }
  };

  const mockCredentials = {
    username: "demo_user",
    password: "demo123",
  };

  const handleQuickFill = () => {
    setUsername(mockCredentials.username);
    setPassword(mockCredentials.password);
  };

  return (
    <div className="card w-full max-w-2xl bg-base-100 p-4 my-8 shadow-2xl border border-primary/20">
      <div className="card-body gap-6">
        <div className="flex flex-col items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-48 h-48" />
          <p className="text-sm text-base-content/60 text-center font-medium">
            Test your knowledge! Log in or sign up automatically to start the
            quiz.{" "}
          </p>
        </div>

        {error && (
          <div className="alert alert-error text-sm py-2 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="fieldset bg-base-200 p-6 rounded-2xl border border-base-300">
            <legend className="fieldset-legend text-xs font-bold uppercase tracking-widest text-primary">
              SIGNIN / Signup
            </legend>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Username</span>
              </label>
              <input
                type="text"
                placeholder="john_doe"
                className="input input-bordered bg-base-100 focus:input-primary w-full font-medium"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <p className="mt-1 text-[10px] text-base-content/40 italic">
                Minimum 3 characters
              </p>
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text font-bold">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered bg-base-100 focus:input-primary w-full font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="mt-1 text-[10px] text-base-content/40 italic">
                Minimum 6 characters
              </p>
            </div>
          </fieldset>

          <div className="md:col-span-2 bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-center gap-2">
            <div className="bg-primary/20 p-1 rounded-full">
              <Info className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-[11px] leading-relaxed text-base-content/70 font-medium">
                Don't have an account?{" "}
                <span className="text-primary font-bold">
                  A new account is automatically created{" "}
                </span>{" "}
                if the username doesn't exist.{" "}
              </p>
            </div>
          </div>
          <div className="card-actions flex flex-col gap-3">
            <button
              type="button"
              onClick={handleQuickFill}
              className="btn btn-outline btn-sm w-full text-primary border-primary/30 hover:border-primary hover:bg-primary/5"
            >
              Use Demo Account
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg w-full text-white font-black shadow-lg shadow-primary/30"
            >
              Sign in / Auto-register{" "}
            </button>
          </div>
        </form>

        {/* <div className="divider text-[10px] font-bold text-base-content/30 uppercase tracking-[0.2em]">
          Attention
        </div>

        <div className="bg-primary/5 p-4 rounded-xl flex gap-4 items-center border border-primary/10">
          <span className="text-2xl">✨</span>
          <p className="text-[11px] leading-relaxed text-base-content/70 font-medium">
            Our system will{" "}
            <span className="text-primary font-bold">
              automatically register a new account
            </span>{" "}
            if the username is not yet registered.
          </p>
        </div> */}
      </div>
    </div>
  );
}
