import { useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  patchTask,
} from "../api/tasks";
import type {
  TaskItem,
  TaskPriority,
  TaskStatus,
} from "../types/task";

export function useTasks(initialTasks: TaskItem[] | null) {
  const [tasks, setTasks] = useState<TaskItem[] | null>(initialTasks);
  const [savingTask, setSavingTask] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
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
    const created = await createTask(title);

    setTasks((prev) =>
      prev ? [created, ...prev] : [created]
    );
  }

  function startEdit(task: TaskItem) {
    setEditingId(task.id);
    setEditingTitle(task.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function saveTitle(task: TaskItem) {
    const trimmed = editingTitle.trim();

    if (!trimmed || trimmed === task.title) {
      setEditingId(null);
      return;
    }

    const updated = await patchTask(task.id, {
      title: trimmed,
    });

    setTasks((prev) =>
      prev?.map((x) =>
        x.id === task.id ? updated : x
      ) ?? null
    );

    setEditingId(null);
  }

  async function changeStatus(
    task: TaskItem,
    status: TaskStatus
  ) {
    const updated = await patchTask(task.id, {
      status,
    });

    setTasks((prev) =>
      prev?.map((x) =>
        x.id === task.id ? updated : x
      ) ?? null
    );
  }

  async function changePriority(
    task: TaskItem,
    priority: TaskPriority
  ) {
    const updated = await patchTask(task.id, {
      priority,
    });

    setTasks((prev) =>
      prev?.map((x) =>
        x.id === task.id ? updated : x
      ) ?? null
    );
  }

  async function confirmDeleteTask() {
    if (!taskToDelete) return;

    await deleteTask(taskToDelete.id);

    setTasks((prev) =>
      prev?.filter((x) => x.id !== taskToDelete.id) ?? null
    );

    setTaskToDelete(null);
  }

  return {
    tasks,
    setTasks,

    stats,

    savingTask,
    setSavingTask,

    editingId,
    editingTitle,
    setEditingTitle,

    taskToDelete,
    setTaskToDelete,

    addTask,

    startEdit,
    cancelEdit,
    saveTitle,

    changeStatus,
    changePriority,

    confirmDeleteTask,
  };
}