import Header from "@/components/Header";
import JobCard from "@/components/JobCard";
import AdsBox from "@/components/AdsBox";
import { fetchAllJobs } from "@/lib/supabase";

export default async function JobsPage() {
  const jobs = await fetchAllJobs();

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* LEFT SIDE */}
        <section className="md:col-span-3 space-y-6">

          {/* PAGE TITLE */}
          
          <div>
            <h2 className="text-2xl font-bold">
              All Government Jobs
            </h2>
            <p className="text-sm text-gray-600">
              Latest central and state government job notifications
            </p>
          </div>

          {/* SEARCH BAR (UI only for now) */}
          <div className="border rounded p-3">
            <input
              type="text"
              placeholder="Search by job title..."
              className="w-full border rounded px-3 py-2 text-sm"
            />
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

        </section>

        <h3 className="text-xl font-semibold">
        Latest Notifications
        </h3>

        {/* RIGHT SIDE */}
        <aside className="space-y-6">

        <div className="bg-white border rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Upcoming Exams</h3>
            <ul className="text-sm space-y-3">
            <li className="flex justify-between">
                <span>UPSC Prelims</span>
                <span className="text-gray-500">May</span>
            </li>
            <li className="flex justify-between">
                <span>SSC CHSL</span>
                <span className="text-gray-500">June</span>
            </li>
            <li className="flex justify-between">
                <span>IBPS Clerk</span>
                <span className="text-gray-500">July</span>
            </li>
            </ul>
        </div>

        <div className="sticky top-6">
            <AdsBox />
        </div>

        </aside>

      </main>
    </>
  );
}
