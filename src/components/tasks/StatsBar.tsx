type StatsBarProps = {
  total: number;
  backlog: number;
  inProgress: number;
  done: number;
};

export function StatsBar({ total, backlog, inProgress, done }: StatsBarProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-4">
      <StatCard label="Total" value={total} />
      <StatCard label="Backlog" value={backlog} />
      <StatCard label="In progress" value={inProgress} />
      <StatCard label="Done" value={done} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}