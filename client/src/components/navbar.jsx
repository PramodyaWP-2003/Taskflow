import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const link = ({ isActive }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-900/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500">
            <LayoutDashboard size={18} />
          </span>
          TaskBoard
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-300 sm:inline">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-500/80"
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={link}>Login</NavLink>
              <Link
                to="/register"
                className="ml-1 rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}