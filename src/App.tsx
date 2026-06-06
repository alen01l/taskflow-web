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
import { TaskFilters } from "./components/tasks/TaskFilters";
import type { TaskSort } from "./api/tasks";
import { TaskListToolbar } from "./components/tasks/TaskListToolbar";
import { EditTaskModal } from "./components/tasks/EditTaskModal";
import { Toaster } from "react-hot-toast";

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export default function App() {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState<TaskSort>("newest");

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
  editingDescription,
  setEditingDescription,
  editingDueDate,
  setEditingDueDate,
  taskToDelete,
  setTaskToDelete,
  addTask: addTaskToList,
  startEdit,
  cancelEdit,
  saveTask,
  changeStatus,
  changePriority,
  confirmDeleteTask,
} = useTasks(initialTasks, setTasks);

useEffect(() => {
      const timeout = setTimeout(() => {
        setDebouncedSearch(search);
      }, 300);

      return () => clearTimeout(timeout);
    }, [search]);

  useEffect(() => {
    if (!user) return;

    async function reloadTasks() {
      try {
        const list = await getTasks({
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          sort
        });

        setTasks(list);
      } catch (err: unknown) {
        setPageError(getErrorMessage(err, "Could not load tasks."));
      }
    }

    reloadTasks();
  }, [user, debouncedSearch, statusFilter, priorityFilter, setTasks, setPageError, sort]);

  function clearFilters() {
  setSearch("");
  setStatusFilter("");
  setPriorityFilter("");
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

        <TaskFilters
          search={search}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onClear={clearFilters}

        />

        <TaskListToolbar
          count={tasks?.length ?? 0}
          sort={sort}
          onSortChange={setSort}
        />

        <section className="mt-6">
          <TaskList
            tasks={tasks}
            editingId={editingId}
            editingTitle={editingTitle}
            editingDescription={editingDescription}
            onEditingTitleChange={setEditingTitle}
            onEditingDescriptionChange={setEditingDescription}
            editingDueDate={editingDueDate}
            onEditingDueDateChange={setEditingDueDate}
            onStartEdit={startEdit}
            onSaveTask={saveTask}
            onCancelEdit={cancelEdit}
            onChangeStatus={changeStatus}
            onChangePriority={changePriority}
            onDeleteClick={setTaskToDelete}
          />
        </section>
      </div>

      <EditTaskModal
        task={tasks?.find((task) => task.id === editingId) ?? null}
        editingTitle={editingTitle}
        editingDescription={editingDescription}
        editingDueDate={editingDueDate}
        onTitleChange={setEditingTitle}
        onDescriptionChange={setEditingDescription}
        onDueDateChange={setEditingDueDate}
        onSave={saveTask}
        onClose={cancelEdit}
      />

      {taskToDelete && (
        <DeleteModal
          task={taskToDelete}
          onCancel={() => setTaskToDelete(null)}
          onConfirm={confirmDeleteTask}
        />
      )}
      <Toaster position="bottom-right" />
    </main>
  );
}