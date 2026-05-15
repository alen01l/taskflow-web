type PageErrorProps = {
  message: string;
};

export function PageError({ message }: PageErrorProps) {
  return (
    <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}