import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode }) {
  const isRegister = mode === "register";
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // already logged in? go to the boards page
  if (user) return <Navigate to="/" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Can't reach the server. Is it running?");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
  const icon = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400";

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8"
      >
        <div>
          <h1 className="text-2xl font-bold">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isRegister
              ? "Start organizing your projects in minutes."
              : "Log in to see your boards."}
          </p>
        </div>

        {isRegister && (
          <div className="relative">
            <User size={18} className={icon} />
            <input name="name" placeholder="Full name" value={form.name}
              onChange={onChange} className={field} required />
          </div>
        )}

        <div className="relative">
          <Mail size={18} className={icon} />
          <input name="email" type="email" placeholder="Email address" value={form.email}
            onChange={onChange} className={field} required />
        </div>

        <div className="relative">
          <Lock size={18} className={icon} />
          <input name="password" type={show ? "text" : "password"}
            placeholder="Password (min 6 characters)" value={form.password}
            onChange={onChange} className={`${field} pr-10`} required minLength={6} />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Toggle password visibility">
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {!isRegister && (
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        )}

        <button
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 font-semibold text-white shadow-md transition hover:shadow-lg hover:brightness-110 disabled:opacity-70"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {isRegister ? "Create account" : "Log in"}
        </button>

        <p className="text-center text-sm text-slate-500">
          {isRegister ? (
            <>Already have an account?{" "}
              <Link className="font-medium text-indigo-600 hover:underline" to="/login">Log in</Link></>
          ) : (
            <>New here?{" "}
              <Link className="font-medium text-indigo-600 hover:underline" to="/register">Create an account</Link></>
          )}
        </p>
      </form>
    </main>
  );
}