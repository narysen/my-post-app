export default function PostList({ posts, loading, onCreateNew, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden space-y-4">
      {/* Table Header with "+ Create New Post" Button */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Published Posts</h2>
          <span className="text-xs text-gray-500">{posts.length} Total Posts</span>
        </div>

        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Create New Post
        </button>
      </div>

      {loading ? (
        <p className="p-6 text-sm text-gray-500 animate-pulse">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="p-6 text-sm text-gray-500">No blog posts found. Click above to create your first post!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Title</th>
                <th className="px-6 py-3 text-left font-semibold">Author</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-800">{post.title}</td>
                  <td className="px-6 py-4 text-gray-500">{post.authorEmail}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onEdit(post)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-semibold hover:bg-yellow-200 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onDelete(post.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-semibold hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
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