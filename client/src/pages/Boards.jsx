import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Layers, Users, Zap, Plus, Trash2, Sparkles } from "lucide-react";
import { mockBoards } from "../data/mock";

const gradients = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-rose-500",
  "from-fuchsia-500 to-pink-500",
];

const features = [
  { icon: Zap, label: "Drag & drop" },
  { icon: Layers, label: "Lists & cards" },
  { icon: Users, label: "Team ready" },
];

export default function Boards() {
  const [boards, setBoards] = useState(mockBoards);
  const [title, setTitle] = useState("");

  const addBoard = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBoards([...boards, { id: crypto.randomUUID(), title: title.trim() }]);
    setTitle("");
  };

  const deleteBoard = (board) => {
    if (!window.confirm(`Delete board "${board.title}"? This can't be undone.`)) return;
    setBoards((prev) => prev.filter((b) => b.id !== board.id));
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <div className="float-icon relative">
          <div className="absolute inset-0 rounded-3xl bg-sky-400/40 blur-2xl" />
          <div className="relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-2xl ring-1 ring-white/30">
            <LayoutDashboard size={38} className="text-white" />
          </div>
        </div>

        <h1 className="mt-6 bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          Plan it. Drag it. Done.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
          Boards, lists and cards for you and your team, organised in one clean workspace.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {features.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-sky-100 backdrop-blur"
            >
              <Icon size={14} /> {label}
            </span>
          ))}
        </div>
      </section>

      {/* Boards (centered) */}
      <section className="mt-12">
        <div className="mb-5 flex items-center justify-center gap-2 text-white">
          <Sparkles size={18} className="text-sky-300" />
          <h2 className="text-xl font-semibold">Your boards</h2>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">{boards.length}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {boards.map((b, i) => (
            <div key={b.id} className="group relative w-full max-w-sm sm:w-64">
              <Link
                to={`/boards/${b.id}`}
                className={`flex h-32 flex-col justify-between rounded-2xl bg-gradient-to-br ${gradients[i % gradients.length]} p-4 pr-12 text-white shadow-lg ring-1 ring-white/20 transition hover:-translate-y-1 hover:shadow-2xl`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/25">
                  <LayoutDashboard size={16} />
                </span>
                <span className="truncate text-lg font-semibold">{b.title}</span>
              </Link>
              <button
                type="button"
                onClick={() => deleteBoard(b)}
                aria-label={`Delete board ${b.title}`}
                className="absolute right-2 top-2 rounded-lg bg-black/25 p-1.5 text-white transition hover:bg-red-600 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <form
            onSubmit={addBoard}
            className="flex h-32 w-full max-w-sm flex-col justify-center gap-2 rounded-2xl border-2 border-dashed border-white/25 bg-white/5 p-3 backdrop-blur sm:w-64"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New board title"
              className="w-full rounded-lg bg-white/90 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-4 focus:ring-sky-300/40"
            />
            <button className="flex items-center justify-center gap-1 rounded-lg bg-sky-500 py-1.5 text-sm font-medium text-white transition hover:bg-sky-400">
              <Plus size={16} /> Create board
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}