export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg)]"
    >
      <div className="bg-pattern absolute inset-0" />
      <div className="float-slow absolute -left-24 top-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="float-slower absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
    </div>
  );
}