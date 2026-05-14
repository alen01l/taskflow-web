type LoginFormProps = {
  authError: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function LoginForm({ authError, onSubmit }: LoginFormProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-sm text-indigo-200">
            Personal productivity, rebuilt properly
          </div>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
            Bring your tasks back under control.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            TaskFlow is your small, focused workspace for planning work, tracking progress, and keeping momentum.
          </p>
        </div>

        <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-white p-8 text-slate-950 shadow-2xl">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Use the demo account to continue.</p>

          {authError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {authError}
            </div>
          )}

          <label className="mt-6 block text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            defaultValue="demo@taskflow.local"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

          <label className="mt-4 block text-sm font-medium text-slate-700">Password</label>
          <input
            name="password"
            type="password"
            defaultValue="Pass123$"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          />

          <button className="mt-6 w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-200">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}