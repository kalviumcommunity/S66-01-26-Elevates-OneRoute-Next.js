interface FollowUpItemProps {
  date: string;
  title: string;
  badge: string;
}

export default function FollowUpItem({
  date,
  title,
  badge,
}: FollowUpItemProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex gap-6">
        <span className="text-sm text-gray-500 w-24">{date}</span>
        <span className="text-sm text-gray-800">{title}</span>
      </div>

      <span className="text-xs px-3 py-1 rounded-full border text-gray-600">
        {badge}
      </span>
    </div>
  );
}
