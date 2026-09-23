import { useDraggable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

// stops the delete button from starting a drag
const stop = (e) => e.stopPropagation();

export function CardBody({ card, onDelete, className = "" }) {
  return (
    <div
      className={`group flex items-start gap-2 rounded-xl bg-white p-3 text-left text-sm shadow-sm ring-1 ring-slate-200 ${className}`}
    >
      <span className="min-w-0 flex-1 break-words">{card.title}</span>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(card)}
          onMouseDown={stop}
          onTouchStart={stop}
          aria-label={`Delete card ${card.title}`}
          className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export default function Card({ card, onDelete }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: card.id });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab touch-manipulation ${isDragging ? "opacity-30" : ""}`}
    >
      <CardBody
        card={card}
        onDelete={onDelete}
        className="transition hover:-translate-y-0.5 hover:shadow-md"
      />
    </div>
  );
}