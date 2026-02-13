const Block = ({ className }: { className: string }) => (
  <div className={`rounded bg-gray-200 ${className}`} />
);

export default function UserProfileLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <Block className="h-4 w-64" />
      </div>
      <div className="animate-pulse rounded-lg bg-white p-6 shadow space-y-4">
        <Block className="h-3 w-32" />
        <Block className="h-8 w-48" />
        {[...Array(4)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Block className="h-4 w-24" />
            <Block className="h-3 w-48" />
          </div>
        ))}
      </div>
    </div>
  );
}
