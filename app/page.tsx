import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import AdsBox from "@/components/AdsBox";
import { fetchJobs } from "@/lib/supabase";

export default async function HomePage() {
  const jobs = await fetchJobs();

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* LEFT SIDE - JOB CONTENT */}
        <section className="md:col-span-3 space-y-6">
          
          {/* HERO */}
          <div className="bg-blue-50 border rounded-lg p-6">
            <h2 className="text-2xl font-bold">
              Latest Government Job Updates
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Free job alerts for SSC, Banking, Railways, UPSC & State Govt
            </p>
          </div>

          {/* JOB LIST */}
          <div className="grid sm:grid-cols-2 gap-4">
            {jobs.map((job: any) => (
              <JobCard
                key={job.id}
                title={job.title}
                department={job.department}
                location={job.location}
                last_date={job.last_date}
              />
            ))}
          </div>

          {/* VIEW ALL */}
          <div className="text-center">
            <a
              href="/jobs"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded"
            >
              View All Govt Jobs
            </a>
          </div>
        </section>

        {/* RIGHT SIDE - ADS + EXAMS */}
        <aside className="space-y-6">
          <AdsBox />

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Upcoming Exams</h3>
            <ul className="text-sm space-y-2">
              <li>• UPSC Prelims – May</li>
              <li>• SSC CHSL – June</li>
              <li>• IBPS Clerk – July</li>
            </ul>
          </div>

          <AdsBox />
        </aside>
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">
        Disclaimer: This is not a government website.
      </footer>
    </>
  );
}
