import { useEffect, useState } from "react";
import { api } from "./lib/apiClient";

type TaskItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
};

async function patchTask(id: string, data: any) {
  return api<TaskItem>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

async function deleteTaskApi(id: string) {
  await api<void>(`/tasks/${id}`, { method: "DELETE" });
}

export default function App() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [tasks, setTasks] = useState<TaskItem[] | null>(null);
  const [title, setTitle] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);

  // Check session on load
  useEffect(() => {
    (async () => {
      try {
        const me = await api<{ id: string; email: string } | null>("/auth/me");
        setUser(me);
        setLoading(false);
        if (me) {
          const list = await api<TaskItem[]>("/tasks");
          setTasks(list);
        }
      } catch {
        setLoading(false);
      }
    })();
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      const me = await api<{ id: string; email: string }>("/auth/me");
      setUser(me);
      const list = await api<TaskItem[]>("/tasks");
      setTasks(list);
    } catch (err: any) {
      setAuthError(err?.message || "Login failed");
    }
  }

  async function logout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
    setTasks(null);
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const created = await api<TaskItem>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title: title.trim() }),
    });
    setTasks((prev) => (prev ? [created, ...prev] : [created]));
    setTitle("");
  }

  async function startEdit(t: TaskItem) {
  setEditingId(t.id);
  setEditingTitle(t.title);
}

async function saveTitle(t: TaskItem) {
  const trimmed = editingTitle.trim();
  if (!trimmed || trimmed === t.title) {
    setEditingId(null);
    return;
  }
  const updated = await patchTask(t.id, { title: trimmed });
  setTasks(prev => prev?.map(x => x.id === t.id ? updated : x) ?? null);
  setEditingId(null);
}

function cancelEdit() {
  setEditingId(null);
}

async function changeStatus(t: TaskItem, status: string) {
  const updated = await patchTask(t.id, { status });
  setTasks(prev => prev?.map(x => x.id === t.id ? updated : x) ?? null);
}

async function changePriority(t: TaskItem, priority: string) {
  const updated = await patchTask(t.id, { priority });
  setTasks(prev => prev?.map(x => x.id === t.id ? updated : x) ?? null);
}

async function deleteTask(t: TaskItem) {
  const ok = window.confirm(`Delete "${t.title}"?`);
  if (!ok) return;
  await deleteTaskApi(t.id);
  setTasks(prev => prev?.filter(x => x.id !== t.id) ?? null);
}

function DeleteModal() {
  if (!showDeleteModal || !taskToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-150">
  <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm animate-fadeIn">
        <h2 className="text-lg font-semibold mb-3">Delete task?</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete <span className="font-medium">"{taskToDelete.title}"</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setTaskToDelete(null);
              setShowDeleteModal(false);
            }}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await deleteTaskApi(taskToDelete.id);
              setTasks(prev => prev?.filter(x => x.id !== taskToDelete.id) ?? null);
              setShowDeleteModal(false);
              setTaskToDelete(null);
            }}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;

  // Not logged in → login form
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <form onSubmit={login} className="w-full max-w-sm bg-white rounded-xl p-6 shadow">
          <h1 className="text-xl font-semibold mb-4">TaskFlow Login</h1>
          {authError && <div className="mb-3 text-sm text-red-600">{authError}</div>}
          <label className="block text-sm mb-1">Email</label>
          <input name="email" defaultValue="demo@taskflow.local" className="w-full border rounded-md px-3 py-2 mb-3" />
          <label className="block text-sm mb-1">Password</label>
          <input name="password" type="password" defaultValue="Pass123$" className="w-full border rounded-md px-3 py-2 mb-4" />
          <button className="w-full rounded-md bg-indigo-600 text-white py-2">Sign in</button>
        </form>
      </div>
    );
  }

  // Logged in → tasks page
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-sm text-gray-600">Signed in as {user.email}</p>
        </div>
        <button onClick={logout} className="rounded-md bg-gray-200 px-3 py-1">Logout</button>
      </div>

      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input className="flex-1 border rounded-md px-3 py-2" placeholder="Quick add a task…" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="rounded-md bg-indigo-600 text-white px-4">Add</button>
      </form>

      {!tasks ? (
  <p>Loading tasks…</p>
) : tasks.length === 0 ? (
  <p>No tasks yet.</p>
) : (
  <ul className="space-y-2">
    {tasks.map((t) => {
      const isEditing = editingId === t.id;
      return (
        <li key={t.id} className="border rounded-md p-3 bg-white flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* Title: editable */}
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 border rounded-md px-3 py-2"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveTitle(t); if (e.key === "Escape") cancelEdit(); }}
                  autoFocus
                />
                <button
                  className="rounded-md bg-indigo-600 text-white px-3 py-1"
                  onClick={() => saveTitle(t)}
                >
                  Save
                </button>
                <button className="rounded-md bg-gray-200 px-3 py-1" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="font-medium">{t.title}</div>
                <button className="text-sm text-indigo-600" onClick={() => startEdit(t)}>
                  Edit
                </button>
              </div>
            )}

            {/* Meta line */}
            <div className="mt-1 text-sm text-gray-600">
              Status: {t.status} · Priority: {t.priority}
            </div>

            {/* Inline controls */}
            <div className="mt-2 flex gap-2 items-center">
              <label className="text-sm">Status</label>
              <select
                className="border rounded-md px-2 py-1"
                value={t.status}
                onChange={(e) => changeStatus(t, e.target.value)}
              >
                <option>Backlog</option>
                <option>InProgress</option>
                <option>Done</option>
              </select>

              <label className="text-sm ml-3">Priority</label>
              <select
                className="border rounded-md px-2 py-1"
                value={t.priority}
                onChange={(e) => changePriority(t, e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* Delete */}
          <div>
            <button
              className="rounded-md bg-red-600 text-white px-3 py-1"
              onClick={() => {
  setTaskToDelete(t);
  setShowDeleteModal(true);
}}
              title="Delete"
            >
              Delete
            </button>
          </div>
        </li>
      );
    })}
  </ul>
)}
<DeleteModal />
    </div>
  );
}
