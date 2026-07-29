import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./lib/firebaseClient";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import AdminPortalPage from "./pages/AdminPortalPage";
import PostsManager from "./pages/PostsManager";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setCheckingSession(false);
      setIsSidebarOpen(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      setIsSidebarOpen(false);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse font-medium">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      <div className="flex flex-1 pt-16 relative">
        {user && (
          <Sidebar 
            user={user} 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
          />
        )}

        <main className={`flex-1 p-4 md:p-6 transition-all duration-300 ${user && isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            
            {/* Admin Portal Protected Routes */}
            <Route 
              path="/admin" 
              element={user ? <AdminPortalPage user={user} /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/admin/posts" 
              element={user ? <PostsManager user={user} /> : <Navigate to="/login" replace />} 
            />

            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={!user ? <LoginPage /> : <Navigate to="/admin" replace />} 
            />
            <Route 
              path="/register" 
              element={!user ? <RegisterPage /> : <Navigate to="/admin" replace />} 
            />
          </Routes>
        </main>
      </div>

      <div className={`transition-all duration-300 ${user && isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}>
        <Footer />
      </div>
    </div>
  );
}