"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("demo@pulse.ai");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TEMP: skip backend for now
      router.push("/dashboard");
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-slate-800">
          Pulse AI
        </h1>
        <p className="text-sm text-center text-slate-500 mt-1">
          Your AI Project Intelligence Partner
        </p>

        <form onSubmit={onSubmit} className="space-y-5 mt-8">
          <input
            type="email"
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full border border-slate-300 rounded-lg px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-2 rounded-lg"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
