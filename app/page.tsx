import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import AdsBox from "@/components/AdsBox";
import { fetchJobs } from "@/lib/supabase";
import StatsSection from "@/components/StatsSection";
import { fetchJobStats } from "@/lib/supabase";

export default async function HomePage() {
  const jobs = await fetchJobs();
  const stats = await fetchJobStats();

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* LEFT SIDE - JOB CONTENT */}
        <section className="md:col-span-3 space-y-6">
          
          {/* HERO */}
          <StatsSection
            total={stats.total}
            active={stats.active}
          />
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl p-8 shadow">
            <h2 className="text-3xl font-bold">
              Find Latest Government Jobs in India
            </h2>
            <p className="mt-2 text-sm opacity-90">
              SSC • Banking • Railway • UPSC • State Govt
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href="/jobs"
                className="bg-white text-blue-600 px-6 py-2 rounded font-medium"
              >
                Browse Jobs
              </a>

              <a
                href="#"
                className="border border-white px-6 py-2 rounded"
              >
                Upcoming Exams
              </a>
            </div>
          </div>

          {/* JOB LIST */}
          <div className="grid sm:grid-cols-2 gap-4">
            {jobs.map((job: any) => (
              <JobCard
                key={job.id}
                title={job.title}
                department={job.department}
                location={job.location}
                last_date={job.last_date} id={0}              />
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
