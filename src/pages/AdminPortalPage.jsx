import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../lib/firebaseClient";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { StatCard, RecentPostsTable } from "../components/DashboardComponents";

export default function AdminPortalPage({ user }) {
  const [stats, setStats] = useState({
    totalPosts: 0,
    myPosts: 0,
    postsWithImages: 0,
    lastPostDate: "N/A",
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStats() {
      setLoading(true);
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const total = postsData.length;
        
        // Flexible check to match posts authored by user across different fields
        const userEmail = user?.email?.toLowerCase();
        const userName = user?.displayName?.toLowerCase() || (userEmail ? userEmail.split('@')[0] : "");
        
        const myCount = postsData.filter((p) => {
          const pEmail = p.authorEmail?.toLowerCase() || "";
          const pName = p.authorName?.toLowerCase() || p.author?.toLowerCase() || "";
          const pUser = p.userName?.toLowerCase() || "";
          
          return (
            (userEmail && pEmail === userEmail) ||
            (userName && (pName.includes(userName) || pUser.includes(userName)))
          );
        }).length;
        
        const withImages = postsData.filter((p) => {
          if (p.imageUrl) return true;
          if (!p.content) return false;
          const parser = new DOMParser();
          const doc = parser.parseFromString(p.content, "text/html");
          return doc.querySelector("img") !== null;
        }).length;

        let latestDate = "No posts yet";
        if (postsData.length > 0 && postsData[0].createdAt?.toDate) {
          latestDate = postsData[0].createdAt.toDate().toLocaleDateString();
        }

        setStats({
          totalPosts: total,
          myPosts: myCount,
          postsWithImages: withImages,
          lastPostDate: latestDate,
        });

        setRecentPosts(postsData.slice(0, 5));
      } catch (error) {
        console.error("Error loading admin stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminStats();
  }, [user]);

  return (
    <div className="space-y-6 pl-3">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h1>
        </div>

        <Link
          to="/admin/posts"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center self-start sm:self-auto"
        >
          Manage All Posts
        </Link>
      </div>

      {/* Real Statistics Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Published Posts" 
          value={loading ? "..." : stats.totalPosts} 
          color="text-blue-600" 
        />
        <StatCard 
          title="Authored by You" 
          value={loading ? "..." : stats.myPosts} 
          color="text-green-600" 
        />
        <StatCard 
          title="Posts with Images" 
          value={loading ? "..." : stats.postsWithImages} 
          color="text-purple-600" 
        />
        <StatCard 
          title="Latest Activity" 
          value={loading ? "..." : stats.lastPostDate} 
          color="text-amber-600" 
          isText={true}
        />
      </div>

      {/* Live Recent Posts Table */}
      <RecentPostsTable posts={recentPosts} loading={loading} />
    </div>
  );
}