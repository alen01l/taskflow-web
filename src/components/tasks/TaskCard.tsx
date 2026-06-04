import type { TaskItem, TaskPriority, TaskStatus } from "../../types/task";

const statusOptions: TaskStatus[] = ["Backlog", "InProgress", "Done"];
const priorityOptions: TaskPriority[] = ["Low", "Medium", "High"];

function statusLabel(status: TaskStatus) {
  return status === "InProgress" ? "In progress" : status;
}

function statusBadgeClass(status: TaskStatus) {
  switch (status) {
    case "Done":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "InProgress":
      return "border-blue-200 bg-blue-50 text-blue-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function priorityBadgeClass(priority: TaskPriority) {
  switch (priority) {
    case "High":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function isOverdue(dueAtUtc: string | null, status: TaskItem["status"]) {
  if (!dueAtUtc || status === "Done") return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(dueAtUtc);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function formatDueDate(dueAtUtc: string) {
  return new Date(dueAtUtc).toLocaleDateString();
}

type TaskCardProps = {
  task: TaskItem;
  isEditing: boolean;
  editingTitle: string;
  onEditingTitleChange: (title: string) => void;
  onStartEdit: (task: TaskItem) => void;
  onSaveTask: (task: TaskItem) => void;
  onCancelEdit: () => void;
  onChangeStatus: (task: TaskItem, status: TaskStatus) => void;
  onChangePriority: (task: TaskItem, priority: TaskPriority) => void;
  onDeleteClick: (task: TaskItem) => void;
  editingDescription: string;
  onEditingDescriptionChange: (value: string) => void;
  editingDueDate: string;
onEditingDueDateChange: (value: string) => void;
};

export function TaskCard({
  task,
  isEditing,
  editingTitle,
  onEditingTitleChange,
  editingDescription,
  onStartEdit,
  onSaveTask,
  onCancelEdit,
  onChangeStatus,
  onChangePriority,
  onEditingDescriptionChange,
  onDeleteClick,
}: TaskCardProps) {
  return (
    <li
      className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${task.status === "Done"
          ? "border-emerald-200 bg-emerald-50/60 opacity-80"
          : "border-slate-200 bg-white"
        }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
  <h2
    className={`break-words text-lg font-semibold leading-7 ${
      task.status === "Done" ? "text-slate-500 line-through" : ""
    }`}
  >
    {task.title}
  </h2>

  <button
    type="button"
    className="rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
    onClick={() => onStartEdit(task)}
  >
    Edit
  </button>
</div>

          {task.description && (
            <p
              className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${task.status === "Done"
                ? "text-slate-400"
                : "text-slate-600"
                }`}
            >
              {task.description}
            </p>
          )}

          {task.dueAtUtc && (
            <p
              className={`mt-2 text-sm font-medium ${task.status !== "Done" && new Date(task.dueAtUtc) < new Date()
                  ? "text-rose-600"
                  : "text-slate-500"
                }`}
            >
              {task.status !== "Done" && new Date(task.dueAtUtc) < new Date()
                ? "Overdue"
                : "Due"}{" "}
              {new Date(task.dueAtUtc).toLocaleDateString()}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(task.status)}`}>
              {statusLabel(task.status)}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityBadgeClass(task.priority)}`}>
              {task.priority} priority
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] lg:min-w-[420px]">
          <label className="text-sm font-medium text-slate-600">
            Status
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              value={task.status}
              onChange={(e) => onChangeStatus(task, e.target.value as TaskStatus)}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-600">
            Priority
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              value={task.priority}
              onChange={(e) => onChangePriority(task, e.target.value as TaskPriority)}
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="self-end rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            onClick={() => onDeleteClick(task)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}