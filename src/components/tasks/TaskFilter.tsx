import type { TaskStatus, TaskPriority } from "../../types/task";

type TaskFiltersProps = {
  search: string;
  statusFilter: TaskStatus | "";
  priorityFilter: TaskPriority | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
  onPriorityChange: (value: TaskPriority | "") => void;
};

export function TaskFilters({
  search,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
          className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">All statuses</option>
          <option value="Backlog">Backlog</option>
          <option value="InProgress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "")}
          className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </section>
  );
}