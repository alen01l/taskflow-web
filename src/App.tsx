import { useEffect, useMemo, useState } from "react";
import { api } from "./lib/apiClient";
import { TaskCard } from "./components/tasks/TaskCard";
import { DeleteModal } from "./components/tasks/DeleteModal";
import { StatsBar } from "./components/tasks/StatsBar";
import { LoginForm } from "./components/LoginForm";
import { TaskList } from "./components/tasks/TaskList";

type TaskStatus = "Backlog" | "InProgress" | "Done";
type TaskPriority = "Low" | "Medium" | "High";

type TaskItem = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
};

type User = {
  id: string;
  email: string;
};

type TaskPatch = Partial<{
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
}>;

async function patchTask(id: string, data: TaskPatch) {
  return api<TaskItem>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function deleteTaskApi(id: string) {
  await api<void>(`/tasks/${id}`, { method: "DELETE" });
}

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}



export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskItem[] | null>(null);
  const [title, setTitle] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingTask, setSavingTask] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);

  const taskStats = useMemo(() => {
    const list = tasks ?? [];
    return {
      total: list.length,
      backlog: list.filter((task) => task.status === "Backlog").length,
      inProgress: list.filter((task) => task.status === "InProgress").length,
      done: list.filter((task) => task.status === "Done").length,
    };
  }, [tasks]);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      try {
        const me = await api<User | null>("/auth/me");
        if (ignore) return;

        setUser(me);

        if (me) {
          const list = await api<TaskItem[]>("/tasks");
          if (!ignore) setTasks(list);
        }
      } catch (err: unknown) {
        if (!ignore) setPageError(getErrorMessage(err, "Could not load your session."));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadSession();

    return () => {
      ignore = true;
    };
  }, []);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const me = await api<User>("/auth/me");
      const list = await api<TaskItem[]>("/tasks");

      setUser(me);
      setTasks(list);
    } catch (err: unknown) {
      setAuthError(getErrorMessage(err, "Login failed."));
    }
  }

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
    setTasks(null);
    setTitle("");
    setEditingId(null);
    setTaskToDelete(null);
  }

  async function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || savingTask) return;

    setSavingTask(true);
    setPageError(null);

    try {
      const created = await api<TaskItem>("/tasks", {
        method: "POST",
        body: JSON.stringify({ title: trimmed }),
      });

      setTasks((prev) => (prev ? [created, ...prev] : [created]));
      setTitle("");
    } catch (err: unknown) {
      setPageError(getErrorMessage(err, "Could not create task."));
    } finally {
      setSavingTask(false);
    }
  }

  function startEdit(task: TaskItem) {
    setEditingId(task.id);
    setEditingTitle(task.title);
  }

  async function saveTitle(task: TaskItem) {
    const trimmed = editingTitle.trim();

    if (!trimmed || trimmed === task.title) {
      setEditingId(null);
      return;
    }

    try {
      const updated = await patchTask(task.id, { title: trimmed });
      setTasks((prev) => prev?.map((item) => (item.id === task.id ? updated : item)) ?? null);
      setEditingId(null);
    } catch (err: unknown) {
      setPageError(getErrorMessage(err, "Could not update task title."));
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function changeStatus(task: TaskItem, status: TaskStatus) {
    try {
      const updated = await patchTask(task.id, { status });
      setTasks((prev) => prev?.map((item) => (item.id === task.id ? updated : item)) ?? null);
    } catch (err: unknown) {
      setPageError(getErrorMessage(err, "Could not update task status."));
    }
  }

  async function changePriority(task: TaskItem, priority: TaskPriority) {
    try {
      const updated = await patchTask(task.id, { priority });
      setTasks((prev) => prev?.map((item) => (item.id === task.id ? updated : item)) ?? null);
    } catch (err: unknown) {
      setPageError(getErrorMessage(err, "Could not update task priority."));
    }
  }

  async function confirmDeleteTask() {
    if (!taskToDelete) return;

    try {
      await deleteTaskApi(taskToDelete.id);
      setTasks((prev) => prev?.filter((item) => item.id !== taskToDelete.id) ?? null);
      setTaskToDelete(null);
    } catch (err: unknown) {
      setPageError(getErrorMessage(err, "Could not delete task."));
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur">
          Loading TaskFlow…
        </div>
      </main>
    );
  }

  if (!user) {
  return <LoginForm authError={authError} onSubmit={login} />;
}

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="border-b border-white/10 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm text-slate-400">Signed in as {user.email}</p>
            <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
          </div>
          <button
            onClick={logout}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <StatsBar
          total={taskStats.total}
          backlog={taskStats.backlog}
          inProgress={taskStats.inProgress}
          done={taskStats.done}
        />

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <form onSubmit={addTask} className="flex flex-col gap-3 sm:flex-row">
            <input
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              placeholder="Quick add a task…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              disabled={savingTask || !title.trim()}
              className="rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {savingTask ? "Adding…" : "Add task"}
            </button>
          </form>
        </section>

        {pageError && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        )}

        <section className="mt-6">
  <TaskList
    tasks={tasks}
    editingId={editingId}
    editingTitle={editingTitle}
    onEditingTitleChange={setEditingTitle}
    onStartEdit={startEdit}
    onSaveTitle={saveTitle}
    onCancelEdit={cancelEdit}
    onChangeStatus={changeStatus}
    onChangePriority={changePriority}
    onDeleteClick={setTaskToDelete}
  />
</section>
      </div>

      {taskToDelete && (
        <DeleteModal
          task={taskToDelete}
          onCancel={() => setTaskToDelete(null)}
          onConfirm={confirmDeleteTask}
        />
      )}
    </main>
  );
}



