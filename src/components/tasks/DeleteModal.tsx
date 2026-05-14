import type { TaskItem } from "../../types/task";

type DeleteModalProps = {
  task: TaskItem;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteModal({ task, onCancel, onConfirm }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Delete task?</h2>
        <p className="mt-3 text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-950">“{task.title}”</span>? This cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}