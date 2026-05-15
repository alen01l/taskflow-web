type AddTaskFormProps = {
  title: string;
  savingTask: boolean;
  onTitleChange: (title: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function AddTaskForm({
  title,
  savingTask,
  onTitleChange,
  onSubmit,
}: AddTaskFormProps) {
  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="Quick add a task…"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <button
          disabled={savingTask || !title.trim()}
          className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {savingTask ? "Adding…" : "Add task"}
        </button>
      </form>
    </section>
  );
}