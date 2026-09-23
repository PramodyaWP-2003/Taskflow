import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import api from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Can't reach the server. Is it running?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8"
      >
        <div>
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your email and we'll create a reset link.
          </p>
        </div>

        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {message && (
          <div className="space-y-1 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <p>{message}</p>
            <p className="text-xs text-emerald-600">
              Email sending isn't set up yet, so the link is printed in the server terminal.
            </p>
          </div>
        )}

        <button
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-110 disabled:opacity-70"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Send reset link
        </button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
        >
          <ArrowLeft size={14} /> Back to login
        </Link>
      </form>
    </main>
  );
}