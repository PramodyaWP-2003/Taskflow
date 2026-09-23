import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus, Trash2 } from "lucide-react";
import Card from "./Card";

export default function List({ list, cards, onAddCard, onDelete, onDeleteCard, accent }) {
  const { setNodeRef, isOver } = useDroppable({ id: list.id });
  const [title, setTitle] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddCard(list.id, title.trim());
    setTitle("");
  };

  return (
    <section
      ref={setNodeRef}
      className={`flex w-full min-w-0 flex-col rounded-2xl bg-white/90 p-3 text-slate-800 shadow-lg backdrop-blur transition ${
        isOver ? "ring-4 ring-sky-300/70" : ""
      }`}
    >
      <header className="mb-3 flex items-center gap-2 px-1">
        <span className={`h-3 w-3 rounded-full ${accent}`} />
        <h3 className="flex-1 truncate text-left font-semibold">{list.title}</h3>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {cards.length}
        </span>
        <button
          type="button"
          onClick={() => onDelete(list)}
          aria-label={`Delete list ${list.title}`}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </header>

      {/* cards scroll vertically inside the list when there are many */}
      <div className="thin-scroll flex max-h-[55vh] min-h-12 flex-col gap-2 overflow-y-auto p-1">
        {cards.map((c) => (
          <Card key={c.id} card={c} onDelete={onDeleteCard} />
        ))}
        {cards.length === 0 && (
          <p className="rounded-xl border-2 border-dashed border-slate-300 py-3 text-center text-xs text-slate-400">
            Drop cards here
          </p>
        )}
      </div>

      <form onSubmit={submit} className="relative mt-3">
        <Plus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a card"
          className="w-full rounded-xl bg-slate-100 py-2 pl-9 pr-3 text-sm outline-none transition focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
      </form>
    </section>
  );
}