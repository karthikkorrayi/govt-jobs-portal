export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <div>
          <h1 className="text-xl font-bold text-blue-700">
            Govt Jobs Portal
          </h1>
          <p className="text-xs text-gray-500">
            Latest Government Job Updates
          </p>
        </div>

        <nav className="space-x-6 text-sm font-medium">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/jobs" className="hover:text-blue-600">All Jobs</a>
          <a href="#" className="hover:text-blue-600">Exams</a>
          <a href="#" className="hover:text-blue-600">Results</a>
        </nav>
      </div>
    </header>
  );
}
