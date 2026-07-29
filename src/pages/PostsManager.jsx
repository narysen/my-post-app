import { useState, useEffect } from "react";
import { db } from "../lib/firebaseClient";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";

export default function PostsManager({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation View Mode: "list" or "form"
  const [viewMode, setViewMode] = useState("list");
  const [editingPost, setEditingPost] = useState(null);

  const postsRef = collection(db, "posts");

  async function fetchPosts() {
    setLoading(true);
    try {
      const q = query(postsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  // Trigger form view for brand new post
  function handleOpenCreate() {
    setEditingPost(null);
    setViewMode("form");
  }

  // Trigger form view for existing post
  function handleOpenEdit(post) {
    setEditingPost(post);
    setViewMode("form");
  }

  // Handle Save (Create or Update)
  async function handleSavePost(formData) {
    try {
      if (editingPost) {
        const postDoc = doc(db, "posts", editingPost.id);
        await updateDoc(postDoc, {
          title: formData.title,
          content: formData.content,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(postsRef, {
          title: formData.title,
          content: formData.content,
          authorEmail: user?.email || "Admin",
          createdAt: serverTimestamp(),
        });
      }

      setViewMode("list"); // Return to table view
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  }

  // Handle Delete
  async function handleDeletePost(id) {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(db, "posts", id));
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts Management</h1>
        <p className="text-xs text-gray-500 mt-0.5">Create, update, and manage public blog posts.</p>
      </div>

      {/* Conditionally renders either Table List View or Form View */}
      {viewMode === "list" ? (
        <PostList 
          posts={posts} 
          loading={loading} 
          onCreateNew={handleOpenCreate}
          onEdit={handleOpenEdit} 
          onDelete={handleDeletePost} 
        />
      ) : (
        <PostForm 
          editingPost={editingPost} 
          onSubmit={handleSavePost} 
          onCancel={() => setViewMode("list")} 
        />
      )}
    </div>
  );
}
