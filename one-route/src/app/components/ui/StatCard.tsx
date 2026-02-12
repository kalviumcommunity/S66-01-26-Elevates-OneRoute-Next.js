interface StatCardProps {
  title: string;
  value: string;
  description: string;
  valueColor?: string;
}

export default function StatCard({
  title,
  value,
  description,
  valueColor = "text-gray-900",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </div>
  );
}
