import { useEffect, useState } from "react";
import { getMe, login as loginApi, logout as logoutApi } from "../api/auth";
import { getTasks } from "../api/tasks";
import type { TaskItem } from "../types/task";
import type { User } from "../types/user";

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<TaskItem[] | null>(null);

  const [loading, setLoading] = useState(true);

  const [authError, setAuthError] = useState<string | null>(null);

  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      try {
        const me = await getMe();

        if (ignore) return;

        setUser(me);

        if (me) {
          const list = await getTasks();

          if (!ignore) {
            setTasks(list);
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setPageError(
            getErrorMessage(err, "Could not load your session.")
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      ignore = true;
    };
  }, []);

  async function login(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setAuthError(null);

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") ?? "");

    const password = String(
      formData.get("password") ?? ""
    );

    try {
      await loginApi(email, password);

      const me = await getMe();

      const list = await getTasks();

      setUser(me);

      setTasks(list);
    } catch (err: unknown) {
      setAuthError(
        getErrorMessage(err, "Login failed.")
      );
    }
  }

  async function logout() {
    await logoutApi();

    setUser(null);

    setTasks(null);
  }

  return {
    user,
    setUser,

    tasks,
    setTasks,

    loading,

    authError,

    pageError,
    setPageError,

    login,
    logout,
  };
}