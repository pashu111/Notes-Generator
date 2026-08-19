// src/pages/Auth.jsx
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Loader2, Sparkles } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase.js";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../services/api.js";
import { useToast } from "../components/ui/toastContext.js";
import { API_URL } from "../config.js";

const Auth = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: response.user.displayName,
          email: response.user.email,
        }),
      });
      if (!res.ok) throw new Error("Google sign-in failed on the server");
      await getCurrentUser(dispatch);
      toast.success("Welcome back!");
    } catch (err) {
      console.error("Google auth error:", err);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10 text-gray-900 sm:px-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <Sparkles size={20} />
          </span>
          <span className="text-lg font-bold tracking-tight">AI Notes</span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/5 sm:p-8">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Sparkles size={24} />
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Welcome Back 👋</h2>
            <p className="mt-1.5 text-sm text-gray-500">Sign in to continue to AI Notes</p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition-all hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? <Loader2 size={16} className="animate-spin" /> : <FaGoogle size={15} />}
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;