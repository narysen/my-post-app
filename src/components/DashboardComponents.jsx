import { Link } from "react-router-dom";

// Metric Display Card
export function StatCard({ title, value, color = "text-blue-600", isText = false }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`font-bold mt-2 ${isText ? "text-xl" : "text-3xl"} ${color}`}>
        {value}
      </p>
    </div>
  );
}

// Recent Posts Overview Table
export function RecentPostsTable({ posts, loading }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-base font-semibold text-gray-800">Recent Post Activity</h2>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-200/70 px-2 py-0.5 rounded">
          Live Data
        </span>
      </div>

      {loading ? (
        <p className="p-6 text-sm text-gray-500 animate-pulse">Loading statistics...</p>
      ) : posts.length === 0 ? (
        <div className="p-6 text-center space-y-2">
          <p className="text-sm text-gray-500">No blog posts available in the system yet.</p>
          <Link to="/admin/posts" className="text-xs text-blue-600 font-semibold hover:underline">
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Post Title</th>
                <th className="px-6 py-3 text-left font-semibold">Author</th>
                <th className="px-6 py-3 text-left font-semibold">Published Date</th>
                <th className="px-6 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{post.title}</td>
                  <td className="px-6 py-4 text-gray-500">{post.authorEmail}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : "Just now"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/admin/posts"
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}