import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import api from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Can't reach the server. Is it running?");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
  const icon = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

  if (done)
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200">
          <CheckCircle2 size={44} className="mx-auto text-emerald-500" />
          <h1 className="text-2xl font-bold">Password updated</h1>
          <p className="text-sm text-slate-500">You can now log in with your new password.</p>
          <Link
            to="/login"
            className="inline-block rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500"
          >
            Go to login
          </Link>
        </div>
      </main>
    );

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8"
      >
        <div>
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="mt-1 text-sm text-slate-500">Choose a password with at least 6 characters.</p>
        </div>

        <div className="relative">
          <Lock size={18} className={icon} />
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={field}
          />
        </div>

        <div className="relative">
          <Lock size={18} className={icon} />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            className={field}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-110 disabled:opacity-70"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Reset password
        </button>
      </form>
    </main>
  );
}