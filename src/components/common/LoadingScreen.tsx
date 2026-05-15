type LoadingScreenProps = {
  message?: string;
};

export function LoadingScreen({ message = "Loading TaskFlow…" }: LoadingScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 shadow-2xl backdrop-blur">
        {message}
      </div>
    </main>
  );
}