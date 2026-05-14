export type TaskStatus = "Backlog" | "InProgress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export type TaskItem = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type TaskPatch = Partial<{
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}>;