import { useEffect, useState } from "react";
import { DeleteModal } from "./components/tasks/DeleteModal";
import { StatsBar } from "./components/tasks/StatsBar";
import { LoginForm } from "./components/LoginForm";
import { TaskList } from "./components/tasks/TaskList";
import { useTasks } from "./hooks/useTasks";
import { AddTaskForm } from "./components/tasks/AddTaskForm";
import { PageHeader } from "./components/layout/PageHeader";
import { PageError } from "./components/common/PageError";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { useAuth } from "./hooks/useAuth";
import { getTasks } from "./api/tasks";
import type { TaskPriority, TaskStatus } from "./types/task";

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export default function App() {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");

  const {
    user,
    tasks: initialTasks,
    setTasks,
    loading,
    authError,
    pageError,
    setPageError,
    login,
    logout,
  } = useAuth();

  const {
    tasks,
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
  } = useTasks(initialTasks, setTasks);

  useEffect(() => {
    if (!user) return;

    async function reloadTasks() {
      try {
        const list = await getTasks({
          search: search || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
        });

        setTasks(list);
      } catch (err: unknown) {
        setPageError(getErrorMessage(err, "Could not load tasks."));
      }
    }

    reloadTasks();
  }, [user, search, statusFilter, priorityFilter, setTasks, setPageError]);

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
      <PageHeader email={user.email} onLogout={logout} />

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

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "")}
              className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">All statuses</option>
              <option value="Backlog">Backlog</option>
              <option value="InProgress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | "")}
              className="rounded-xl border border-slate-200 px-4 py-2 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">All priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </section>

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