import { useEffect, useState } from "react";
import { api } from "./lib/apiClient";
import { DeleteModal } from "./components/tasks/DeleteModal";
import { StatsBar } from "./components/tasks/StatsBar";
import { LoginForm } from "./components/LoginForm";
import { TaskList } from "./components/tasks/TaskList";
import { useTasks } from "./hooks/useTasks";
import { AddTaskForm } from "./components/tasks/AddTaskForm";
import { PageHeader } from "./components/layout/PageHeader";
import { PageError } from "./components/common/PageError";
import { LoadingScreen } from "./components/common/LoadingScreen";

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
  const [title, setTitle] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    tasks,
    setTasks,
    stats: taskStats,
    savingTask,
    setSavingTask,
    editingId,
    editingTitle,
    setEditingTitle,
    taskToDelete,
    setTaskToDelete,
    addTask: addTaskToList,
    startEdit,
    cancelEdit,
    saveTitle,
    changeStatus,
    changePriority,
    confirmDeleteTask,
  } = useTasks(null);



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
    setTaskToDelete(null);
  }

  async function addTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed || savingTask) return;

    setSavingTask(true);
    setPageError(null);

    try {
      await addTaskToList(trimmed);
      setTitle("");
    } catch (err: unknown) {
      setPageError(getErrorMessage(err, "Could not create task."));
    } finally {
      setSavingTask(false);
    }
  }


  if (loading) {
  return <LoadingScreen />;
}

  if (!user) {
    return <LoginForm authError={authError} onSubmit={login} />;
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <PageHeader
        email={user.email}
        onLogout={logout}
      />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <StatsBar
          total={taskStats.total}
          backlog={taskStats.backlog}
          inProgress={taskStats.inProgress}
          done={taskStats.done}
        />

        <AddTaskForm
          title={title}
          savingTask={savingTask}
          onTitleChange={setTitle}
          onSubmit={addTask}
        />

        {pageError && <PageError message={pageError} />}

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



