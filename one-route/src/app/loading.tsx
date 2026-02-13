export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl space-y-10">
        <div className="space-y-4">
          <div className="h-4 w-48 animate-pulse rounded-full bg-white/20" />
          <div className="h-10 w-3/4 animate-pulse rounded-full bg-white/30" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded-full bg-white/10" />
          <div className="flex gap-3">
            <div className="h-8 w-28 animate-pulse rounded-full bg-white/10" />
            <div className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-xl shadow-black/20"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-white/20" />
                  <div className="h-6 w-40 animate-pulse rounded-full bg-white/40" />
                </div>
                <div className="h-6 w-16 animate-pulse rounded-full bg-emerald-400/20" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/20" />
                <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
              </div>
              <div className="mt-6 h-3 w-32 animate-pulse rounded-full bg-emerald-400/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
