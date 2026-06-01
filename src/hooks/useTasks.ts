import { useMemo, useState } from "react";
import { createTask, deleteTask, patchTask } from "../api/tasks";
import type { TaskItem, TaskPriority, TaskStatus } from "../types/task";

type SetTasks = React.Dispatch<React.SetStateAction<TaskItem[] | null>>;

export function useTasks(tasks: TaskItem[] | null, setTasks: SetTasks) {
  const [savingTask, setSavingTask] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [editingDueDate, setEditingDueDate] = useState("");

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
    const created = await createTask(title);
    setTasks((prev) => (prev ? [created, ...prev] : [created]));
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
      return;
    }

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
    
  }

  async function changeStatus(task: TaskItem, status: TaskStatus) {
  const updated = await patchTask(task.id, {
    status,
    markComplete: status === "Done",
  });

  setTasks((prev) =>
    prev?.map((x) => (x.id === task.id ? updated : x)) ?? null
  );
}

  async function changePriority(task: TaskItem, priority: TaskPriority) {
    const updated = await patchTask(task.id, { priority });
    setTasks((prev) => prev?.map((x) => (x.id === task.id ? updated : x)) ?? null);
  }

  async function confirmDeleteTask() {
    if (!taskToDelete) return;

    await deleteTask(taskToDelete.id);
    setTasks((prev) => prev?.filter((x) => x.id !== taskToDelete.id) ?? null);
    setTaskToDelete(null);
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