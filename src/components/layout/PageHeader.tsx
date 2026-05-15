type PageHeaderProps = {
  email: string;
  onLogout: () => void;
};

export function PageHeader({
  email,
  onLogout,
}: PageHeaderProps) {
  return (
    <div className="border-b border-white/10 bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-sm text-slate-400">
            Signed in as {email}
          </p>

          <h1 className="text-2xl font-bold tracking-tight">
            TaskFlow
          </h1>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
}