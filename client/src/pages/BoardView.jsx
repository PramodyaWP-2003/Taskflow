import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ArrowLeft, Plus, Loader2, UserPlus, X, Crown } from "lucide-react";
import List from "../components/List";
import { CardBody } from "../components/Card";
import api from "../api";

const accents = ["bg-indigo-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500", "bg-sky-500"];

export default function BoardView() {
  const { id } = useParams();

  const [board, setBoard] = useState(null);
  const [role, setRole] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [listTitle, setListTitle] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const isOwner = role === "OWNER";

  const load = () => {
    setLoading(true);
    api
      .get(`/boards/${id}`)
      .then(({ data }) => {
        setBoard(data.board);
        setRole(data.role);
        setLists(data.lists.map((l) => ({ ...l, id: l._id })));
        setCards(data.cards.map((c) => ({ ...c, id: c._id, listId: c.list })));
        setMembers(data.members);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load this board."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  );

  const activeCard = cards.find((c) => c.id === activeId);

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const card = cards.find((c) => c.id === active.id);
    if (!card || card.listId === over.id) return;

    const newPosition = cards.filter((c) => c.listId === over.id).length;
    setCards((prev) =>
      prev.map((c) => (c.id === active.id ? { ...c, listId: over.id, position: newPosition } : c))
    );
    try {
      await api.patch(`/cards/${active.id}`, { listId: over.id, position: newPosition });
    } catch (err) {
      setError(err.response?.data?.message || "Could not move the card.");
      load(); // server එකෙන් ආපහු sync කරගන්නවා
    }
  };

  const addCard = async (listId, title) => {
    try {
      const { data } = await api.post(`/lists/${listId}/cards`, { title });
      setCards((prev) => [...prev, { ...data, id: data._id, listId: data.list }]);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add the card.");
    }
  };

  const deleteCard = async (card) => {
    if (!window.confirm(`Delete card "${card.title}"?`)) return;
    try {
      await api.delete(`/cards/${card.id}`);
      setCards((prev) => prev.filter((c) => c.id !== card.id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the card.");
    }
  };

  const addList = async (e) => {
    e.preventDefault();
    if (!listTitle.trim()) return;
    try {
      const { data } = await api.post(`/boards/${id}/lists`, { title: listTitle.trim() });
      setLists((prev) => [...prev, { ...data, id: data._id }]);
      setListTitle("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add the list.");
    }
  };

  const deleteList = async (list) => {
    const count = cards.filter((c) => c.listId === list.id).length;
    const message = count
      ? `Delete list "${list.title}" and its ${count} card${count > 1 ? "s" : ""}?`
      : `Delete list "${list.title}"?`;
    if (!window.confirm(message)) return;
    try {
      await api.delete(`/lists/${list.id}`);
      setLists((prev) => prev.filter((l) => l.id !== list.id));
      setCards((prev) => prev.filter((c) => c.listId !== list.id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete the list.");
    }
  };

  const inviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setError("");
    try {
      const { data } = await api.post(`/boards/${id}/members`, { email: inviteEmail.trim() });
      setMembers((prev) => [...prev, data]);
      setInviteEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add that member.");
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (member) => {
    if (!window.confirm(`Remove ${member.name} from this board?`)) return;
    try {
      await api.delete(`/boards/${id}/members/${member.id}`);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove that member.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-1 items-center justify-center text-sky-200">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );

  if (!board)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white">
        <p>{error || "Board not found."}</p>
        <Link to="/" className="text-sky-300 underline">Back to boards</Link>
      </div>
    );

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-white">
        <Link
          to="/"
          className="rounded-lg bg-white/10 p-2 transition hover:bg-white/20"
          aria-label="Back to boards"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="truncate text-xl font-bold sm:text-2xl">{board.title}</h1>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">{role}</span>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">{error}</p>
      )}

      {/* Members */}
      <section className="mb-6 rounded-2xl bg-white/10 p-3 text-white backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          {members.map((m) => (
            <span
              key={m.id}
              className="flex items-center gap-1.5 rounded-full bg-white/15 py-1 pl-3 pr-2 text-sm"
            >
              {m.role === "OWNER" && <Crown size={13} className="text-amber-300" />}
              {m.name}
              {isOwner && m.role !== "OWNER" && (
                <button
                  type="button"
                  onClick={() => removeMember(m)}
                  aria-label={`Remove ${m.name}`}
                  className="rounded-full p-0.5 hover:bg-red-500/60"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>

        {isOwner && (
          <form onSubmit={inviteMember} className="relative mt-3 max-w-xs">
            <UserPlus size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Invite by email"
              className="w-full rounded-xl bg-white/15 py-2 pl-9 pr-16 text-sm text-white placeholder-white/60 outline-none focus:bg-white/25"
            />
            <button
              disabled={inviting}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-sky-500 px-2.5 py-1 text-xs font-medium text-white hover:bg-sky-400 disabled:opacity-70"
            >
              {inviting ? "…" : "Add"}
            </button>
          </form>
        )}
      </section>

      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
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