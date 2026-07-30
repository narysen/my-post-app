import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500 animate-pulse font-medium">Loading post content...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12 space-y-4 bg-white rounded-xl border p-8 max-w-2xl mx-auto shadow-sm">
        <p className="text-lg font-semibold text-gray-800">Post Not Found</p>
        <p className="text-sm text-gray-500">The article you are looking for might have been deleted or moved.</p>
        <Link 
          to="/" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          ← Back to Blog Home
        </Link>
      </div>
    );
  }

const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    
    // Ensure BASE_URL doesn't have a trailing slash if url starts with one
    const baseUrl = import.meta.env.BASE_URL.endsWith("/") 
      ? import.meta.env.BASE_URL.slice(0, -1) 
      : import.meta.env.BASE_URL;

    // If url starts with a slash, join it directly with the base path
    if (url.startsWith("/")) {
      return `${baseUrl}${url}`;
    }
    
    return `${baseUrl}/${url}`;
  };
  // Preprocessor for inline HTML content images
  const fixHtmlImages = (html) => {
    if (!html) return "";
    const docParser = new DOMParser().parseFromString(html, "text/html");
    const imgs = docParser.querySelectorAll("img");
    imgs.forEach((img) => {
      const src = img.getAttribute("src");
      if (src && !src.startsWith("http") && !src.startsWith("blob")) {
        img.setAttribute("src", resolveImageUrl(src));
      }
    });
    return docParser.body.innerHTML;
  };

  return (
    <article className="max-w-4xl mx-auto my-6 p-6 md:p-10 bg-white rounded-2xl border border-gray-200 shadow-sm space-y-8 overflow-hidden">
      {/* Navigation Header */}
      <div>
        <Link 
          to="/" 
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline gap-1"
        >
          ← Back to All Posts
        </Link>
      </div>

      {/* Featured Thumbnail Image */}
      {post.imageUrl && (
        <div className="h-72 md:h-96 w-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          <img 
            src={resolveImageUrl(post.imageUrl)} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Article Title & Metadata */}
      <div className="space-y-3 border-b border-gray-100 pb-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight break-words leading-tight">
          {post.title}
        </h1>
        <div className="text-xs md:text-sm text-gray-500 flex flex-wrap justify-between items-center gap-2 pt-2">
          <span className="font-medium">
            Author: <strong className="text-gray-700">{post.authorEmail}</strong>
          </span>
          {post.createdAt?.toDate && (
            <span>
              Published on {post.createdAt.toDate().toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          )} 
        </div>
      </div>

      {/* Styled Article Content Body */}
      <div
        className="
          text-gray-800
          leading-relaxed
          space-y-4
          break-words
          overflow-hidden
          [&_img]:max-w-full
          [&_img]:h-auto
          [&_img]:rounded-xl
          [&_img]:my-6
          [&_img]:shadow-md
          [&_img]:mx-auto
          [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-6 [&_h1]:mb-3
          [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-5 [&_h2]:mb-2
          [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-4 [&_h3]:mb-2
          [&_p]:mb-4 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
          [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4
          [&_a]:text-blue-600 [&_a]:underline
        "
        dangerouslySetInnerHTML={{ __html: fixHtmlImages(post.content) }}
      />
    </article>
  );
}