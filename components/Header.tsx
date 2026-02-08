export default function Header() {
  return (
    <header className="bg-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Govt Jobs for Students
        </h1>

        <nav className="space-x-4 text-sm">
          <a href="/" className="hover:underline">Home</a>
          <a href="/jobs" className="hover:underline">All Jobs</a>
          <a href="/exams" className="hover:underline">Exams</a>
          <a href="/results" className="hover:underline">Results</a>
        </nav>
      </div>
    </header>
  );
}
