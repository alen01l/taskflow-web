import { useEffect, useState } from "react";
import { api } from "./lib/apiClient";

type TaskItem = {
  id: string;
  title: string;
  status: string;
  priority: string;
};

export default function App() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [tasks, setTasks] = useState<TaskItem[] | null>(null);
  const [title, setTitle] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
          {tasks.map((t) => (
            <li key={t.id} className="border rounded-md p-3 bg-white">
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-gray-600">{t.status} · {t.priority}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
