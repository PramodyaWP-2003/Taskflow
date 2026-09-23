import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ArrowLeft, Plus } from "lucide-react";
import List from "../components/List";
import { CardBody } from "../components/Card";
import { mockBoards, mockLists, mockCards } from "../data/mock";

const accents = ["bg-indigo-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500", "bg-sky-500"];

export default function BoardView() {
  const { id } = useParams();
  const board = mockBoards.find((b) => b.id === id);

  const [lists, setLists] = useState(mockLists);
  const [cards, setCards] = useState(mockCards);
  const [listTitle, setListTitle] = useState("");
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const activeCard = cards.find((c) => c.id === activeId);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    setCards((prev) => prev.map((c) => (c.id === active.id ? { ...c, listId: over.id } : c)));
  };

  const addCard = (listId, title) =>
    setCards((prev) => [...prev, { id: crypto.randomUUID(), listId, title }]);

  const deleteCard = (card) => {
    if (!window.confirm(`Delete card "${card.title}"?`)) return;
    setCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  const addList = (e) => {
    e.preventDefault();
    if (!listTitle.trim()) return;
    setLists([...lists, { id: crypto.randomUUID(), title: listTitle.trim() }]);
    setListTitle("");
  };

  const deleteList = (list) => {
    const count = cards.filter((c) => c.listId === list.id).length;
    const message = count
      ? `Delete list "${list.title}" and its ${count} card${count > 1 ? "s" : ""}?`
      : `Delete list "${list.title}"?`;
    if (!window.confirm(message)) return;
    setLists((prev) => prev.filter((l) => l.id !== list.id));
    setCards((prev) => prev.filter((c) => c.listId !== list.id));
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center gap-3 text-white">
        <Link
          to="/"
          className="rounded-lg bg-white/10 p-2 transition hover:bg-white/20"
          aria-label="Back to boards"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="truncate text-xl font-bold sm:text-2xl">{board?.title ?? "Board"}</h1>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        {/* lists wrap onto new rows, so no horizontal scrolling */}
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lists.map((list, i) => (
            <List
              key={list.id}
              list={list}
              accent={accents[i % accents.length]}
              cards={cards.filter((c) => c.listId === list.id)}
              onAddCard={addCard}
              onDelete={deleteList}
              onDeleteCard={deleteCard}
            />
          ))}

          <form onSubmit={addList} className="relative w-full">
            <Plus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80" />
            <input
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              placeholder="Add another list"
              className="w-full rounded-2xl border-2 border-dashed border-white/25 bg-white/10 py-3 pl-9 pr-3 text-sm text-white placeholder-white/70 outline-none backdrop-blur transition focus:bg-white/20"
            />
          </form>
        </div>

        <DragOverlay>
          {activeCard ? (
            <CardBody card={activeCard} className="rotate-2 cursor-grabbing shadow-2xl" />
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}