"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
// import { useGuest } from "@/contexts/GuestContext";

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
//   const { initializeGuestMode } = useGuest();

  const [redirectUrl, setRedirectUrl] = useState("/home");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) setRedirectUrl(redirect);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/backend/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailOrUsername.toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Check if email needs verification
        if (data.requiresVerification) {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
          setError("");
          return;
        }
        setError(data.error || "Login failed");
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user?.username) localStorage.setItem("username", data.user.username);

      router.push(redirectUrl);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    // initializeGuestMode();
    router.push("/home");
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
        
      <div className="w-full max-w-md p-6 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md">
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-[#ffb347] transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Log In</h1>
          <p className="text-gray-400">Welcome back to your quiz journey</p>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username or Email Address
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              placeholder="username or email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                required
                placeholder="password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-bold rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/frontend/signup" className="text-emerald-400 font-semibold">
                Create one here
              </Link>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
