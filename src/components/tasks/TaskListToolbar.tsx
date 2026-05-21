import type { TaskSort } from "../../api/tasks";

type TaskListToolbarProps = {
  count: number;
  sort: TaskSort;
  onSortChange: (value: TaskSort) => void;
};

export function TaskListToolbar({
  count,
  sort,
  onSortChange,
}: TaskListToolbarProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Showing {count} task{count !== 1 ? "s" : ""}
      </p>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as TaskSort)}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priority">Priority</option>
        <option value="status">Status</option>
      </select>
    </div>
  );
}