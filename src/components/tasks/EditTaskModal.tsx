import { useEffect } from "react";
import type { TaskItem } from "../../types/task";

type EditTaskModalProps = {
  task: TaskItem | null;
  editingTitle: string;
  editingDescription: string;
  editingDueDate: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
  onSave: (task: TaskItem) => void;
  onClose: () => void;
};


export function EditTaskModal({
  task,
  editingTitle,
  editingDescription,
  editingDueDate,
  onTitleChange,
  onDescriptionChange,
  onDueDateChange,
  onSave,
  onClose,
}: EditTaskModalProps) {
  if (!task) return null;


useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [onClose]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit task</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <input
            autoFocus
            value={editingTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

          <textarea
            value={editingDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "Enter") {
                onSave(task);
              }
            }}
            placeholder="Add a description..."
            rows={6}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

                  <p
                      className={`text-xs ${editingDescription.length > 1000 ? "text-rose-600" : "text-slate-400"
                          }`}
                  >
                      {editingDescription.length}/1000 characters
                  </p>

                  <label className="block">
                      <span className="text-sm font-medium text-slate-700">
                          Due date
                      </span>

                      <input
                          type="date"
                          value={editingDueDate}
                          onChange={(e) => onDueDateChange(e.target.value)}
                          placeholder="YYYY-MM-DD"
                          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      />
                  </label>
              </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onSave(task)}
            disabled={!editingTitle.trim() || editingDescription.length > 1000}
            className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}