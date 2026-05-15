import { useState } from "react";
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

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export default function App() {
  const [title, setTitle] = useState("");

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