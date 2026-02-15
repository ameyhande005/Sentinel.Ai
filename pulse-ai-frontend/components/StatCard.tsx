export default function StatCard({
  title,
  value,
  subtitle
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="p-4 rounded-xl border bg-white shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
