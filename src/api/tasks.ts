import { api } from "../lib/apiClient";
import type { TaskItem, TaskPatch } from "../types/task";

export async function getTasks(query?: GetTasksQuery) {
  const params = new URLSearchParams();

  if (query?.status) params.set("status", query.status);
  if (query?.priority) params.set("priority", query.priority);
  if (query?.search) params.set("search", query.search);
  if (query?.sort) params.set("sort", query.sort);

  const qs = params.toString();

  return api<TaskItem[]>(qs ? `/tasks?${qs}` : "/tasks");
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

export type TaskSort = "newest" | "oldest" | "priority" | "status";

export type GetTasksQuery = Partial<{
  status: "Backlog" | "InProgress" | "Done";
  priority: "Low" | "Medium" | "High";
  search: string;
  sort: TaskSort;
}>;