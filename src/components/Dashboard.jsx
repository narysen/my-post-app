export function StatCard({ title, value, color = "text-blue-600" }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

export function TableRow({ id, name, status }) {
  const statusColor =
    status === "Active"
      ? "text-green-600"
      : status === "Pending"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <tr>
      <td className="px-6 py-3">{id}</td>
      <td className="px-6 py-3">{name}</td>
      <td className={`px-6 py-3 font-medium ${statusColor}`}>
        {status}
      </td>
    </tr>
  );
}