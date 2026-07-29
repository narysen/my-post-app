export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} My Post App. All rights reserved.
        </p>
      </div>
    </footer>
  );
}