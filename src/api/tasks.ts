import { api } from "../lib/apiClient";
import type { TaskItem, TaskPatch } from "../types/task";

export async function getTasks() {
  return api<TaskItem[]>("/tasks");
}

export async function createTask(title: string) {
  return api<TaskItem>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function patchTask(id: string, data: TaskPatch) {
  return api<TaskItem>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id: string) {
  return api<void>(`/tasks/${id}`, {
    method: "DELETE",
  });
}