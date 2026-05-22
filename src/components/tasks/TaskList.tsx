import { TaskCard } from "./TaskCard";
import type { TaskItem, TaskPriority, TaskStatus } from "../../types/task";

type TaskListProps = {
  tasks: TaskItem[] | null;
  editingId: string | null;
  editingTitle: string;
  onEditingTitleChange: (title: string) => void;
  onStartEdit: (task: TaskItem) => void;
  onSaveTask: (task: TaskItem) => void;
  onCancelEdit: () => void;
  editingDescription: string;
  onEditingDescriptionChange: (value: string) => void;
  onChangeStatus: (task: TaskItem, status: TaskStatus) => void;
  onChangePriority: (task: TaskItem, priority: TaskPriority) => void;
  onDeleteClick: (task: TaskItem) => void;
};

export function TaskList({
  tasks,
  editingId,
  editingTitle,
  editingDescription,
  onEditingTitleChange,
  onEditingDescriptionChange,
  onStartEdit,
  onSaveTask,
  onCancelEdit,
  onChangeStatus,
  onChangePriority,
  onDeleteClick,
}: TaskListProps) {
  if (!tasks) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
        Loading tasks…
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold">No tasks yet</h2>
        <p className="mt-2 text-slate-500">
          Add your first task above and start rebuilding momentum.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isEditing={editingId === task.id}
          editingTitle={editingTitle}
          editingDescription={editingDescription}
          onEditingTitleChange={onEditingTitleChange}
          onEditingDescriptionChange={onEditingDescriptionChange}
          onStartEdit={onStartEdit}
          onSaveTask={onSaveTask}
          onCancelEdit={onCancelEdit}
          onChangeStatus={onChangeStatus}
          onChangePriority={onChangePriority}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </ul>
  );
}