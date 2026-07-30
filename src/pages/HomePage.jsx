import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../lib/firebaseClient";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function fetchPublicPosts() {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching public posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    }

    fetchPublicPosts();
  }, []);

// Helper to check post.imageUrl first, then fallback to parsing HTML content
  const extractThumbnail = (post) => {
    if (post.imageUrl) {
      if (post.imageUrl.startsWith("http://") || post.imageUrl.startsWith("https://")) {
        return post.imageUrl;
      }
      
      const cleanPath = post.imageUrl.replace(/^\/+/, "");
      
      // Force repository base path for GitHub Pages deployment
      const repoBase = window.location.hostname.includes("github.io") ? "/my-post-app/" : "/";
      const base = import.meta.env.BASE_URL && import.meta.env.BASE_URL !== "/" 
        ? import.meta.env.BASE_URL 
        : repoBase;
        
      const formattedBase = base.endsWith("/") ? base : `${base}/`;
      return `${formattedBase}${cleanPath}`;
    }
    
    if (!post.content) return null;
    const doc = new DOMParser().parseFromString(post.content, "text/html");
    const img = doc.querySelector("img");
    return img ? img.src : null;
  };

  const extractSnippet = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || "";
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  };

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Welcome to My Post App.
        </h1>
        <p className="text-lg text-gray-600">
          Discover latest updates, news, and insights.
        </p>
      </section>

      {/* Post Grid View */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Latest Posts</h2>

        {loadingPosts ? (
          <p className="text-gray-500 animate-pulse">Loading blog posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500">No blog posts published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const thumbnail = extractThumbnail(post);
              const snippet = extractSnippet(post.content);

              return (
                <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  {/* Thumbnail Image */}
                  <div className="h-48 bg-gray-100 w-full overflow-hidden flex items-center justify-center">
                    {thumbnail ? (
                      <img src={thumbnail} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-400 font-semibold text-sm">No Image Preview</div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{snippet}</p>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ""}
                      </span>

                      <Link 
                        to={`/post/${post.id}`} 
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}