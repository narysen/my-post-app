import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout, isSidebarOpen, setIsSidebarOpen }) {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 h-16 z-50">
      <nav className="h-full px-4 flex items-center justify-between">
        
        {/* Brand Logo links to /admin if logged in, or / if guest */}
        <div className="flex items-center gap-3">
          <Link 
            to={user ? "/admin" : "/"} 
            className="text-xl font-bold text-blue-600 tracking-tight"
          >
            {user ? "Admin Portal" : "My Post App"}
          </Link>

          {user && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors focus:outline-none"
              aria-label="Toggle Sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>

        {/* User Auth Controls */}
        <div className="flex items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/register" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                Register
              </Link>
              <Link to="/login" className="px-3 py-1.5 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
                Login
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-500 transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}