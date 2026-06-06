import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { createTask, deleteTask, patchTask } from "../api/tasks";
import type { TaskItem, TaskPriority, TaskStatus } from "../types/task";

type SetTasks = React.Dispatch<React.SetStateAction<TaskItem[] | null>>;

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function useTasks(tasks: TaskItem[] | null, setTasks: SetTasks) {
  const [savingTask, setSavingTask] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);

  const stats = useMemo(() => {
    const list = tasks ?? [];

    return {
      total: list.length,
      backlog: list.filter((t) => t.status === "Backlog").length,
      inProgress: list.filter((t) => t.status === "InProgress").length,
      done: list.filter((t) => t.status === "Done").length,
    };
  }, [tasks]);

  async function addTask(title: string) {
    try {
      const created = await createTask(title);
      setTasks((prev) => (prev ? [created, ...prev] : [created]));
      toast.success("Task created");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Could not create task"));
      throw err;
    }
  }

  function startEdit(task: TaskItem) {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description ?? "");
    setEditingDueDate(task.dueAtUtc ? task.dueAtUtc.slice(0, 10) : "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingDueDate("");
  }

  async function saveTask(task: TaskItem) {
    const title = editingTitle.trim();
    const description = editingDescription.trim();

    if (!title) {
      toast.error("Title is required");
      return;
    }

    try {
      const updated = await patchTask(task.id, {
        title,
        description,
        dueAtUtc: editingDueDate ? new Date(editingDueDate).toISOString() : null,
      });

      setTasks((prev) =>
        prev?.map((x) => (x.id === task.id ? updated : x)) ?? null
      );

      setEditingId(null);
      setEditingTitle("");
      setEditingDescription("");
      setEditingDueDate("");

      toast.success("Task saved");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Could not save task"));
    }
  }

  async function changeStatus(task: TaskItem, status: TaskStatus) {
    try {
      const updated = await patchTask(task.id, {
        status,
        markComplete: status === "Done",
      });

      setTasks((prev) =>
        prev?.map((x) => (x.id === task.id ? updated : x)) ?? null
      );

      toast.success("Status updated");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Could not update status"));
    }
  }

  async function changePriority(task: TaskItem, priority: TaskPriority) {
    try {
      const updated = await patchTask(task.id, { priority });

      setTasks((prev) =>
        prev?.map((x) => (x.id === task.id ? updated : x)) ?? null
      );

      toast.success("Priority updated");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Could not update priority"));
    }
  }

  async function confirmDeleteTask() {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);

      setTasks((prev) =>
        prev?.filter((x) => x.id !== taskToDelete.id) ?? null
      );

      setTaskToDelete(null);

      toast.success("Task deleted");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Could not delete task"));
    }
  }

  return {
    tasks,
    stats,

    savingTask,
    setSavingTask,

    editingId,
    editingTitle,
    setEditingTitle,
    editingDescription,
    setEditingDescription,
    editingDueDate,
    setEditingDueDate,

    taskToDelete,
    setTaskToDelete,

    addTask,
    startEdit,
    cancelEdit,
    saveTask,
    changeStatus,
    changePriority,
    confirmDeleteTask,
  };
}