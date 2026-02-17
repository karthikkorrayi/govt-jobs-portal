import DashboardHeader from "@/components/DashboardHeader";
import { fetchJobs, fetchJobStats, fetchUpcomingExams } from "@/lib/supabase";

// ── Inline SVG Logos for Govt Orgs ──────────────────────────────────────────
function SscLogo() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <circle cx="24" cy="24" r="24" fill="#1a3c8f"/>
      <circle cx="24" cy="24" r="20" fill="#fff" opacity="0.1"/>
      <text x="24" y="20" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="bold" fontFamily="serif">SSC</text>
      <text x="24" y="30" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="serif">STAFF SELECTION</text>
      <text x="24" y="37" textAnchor="middle" fill="#fff" fontSize="5" fontFamily="serif">COMMISSION</text>
    </svg>
  );
}

function RailwaysLogo() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <circle cx="24" cy="24" r="24" fill="#1a3c8f"/>
      <rect x="10" y="20" width="28" height="4" rx="2" fill="#FFD700"/>
      <rect x="10" y="28" width="28" height="3" rx="1.5" fill="#FFD700"/>
      <circle cx="16" cy="34" r="3" fill="#FFD700"/>
      <circle cx="32" cy="34" r="3" fill="#FFD700"/>
      <rect x="18" y="14" width="12" height="8" rx="2" fill="#fff" opacity="0.9"/>
      <text x="24" y="21" textAnchor="middle" fill="#1a3c8f" fontSize="6" fontWeight="bold">IR</text>
    </svg>
  );
}

function UpscLogo() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <circle cx="24" cy="24" r="24" fill="#8B0000"/>
      <path d="M24 8 L28 18 L38 18 L30 24 L33 34 L24 28 L15 34 L18 24 L10 18 L20 18 Z" fill="#FFD700"/>
      <circle cx="24" cy="24" r="6" fill="#8B0000"/>
      <text x="24" y="44" textAnchor="middle" fill="#FFD700" fontSize="5" fontWeight="bold">UPSC</text>
    </svg>
  );
}

function DrdoLogo() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <circle cx="24" cy="24" r="24" fill="#006400"/>
      <circle cx="24" cy="24" r="14" fill="none" stroke="#FFD700" strokeWidth="2"/>
      <text x="24" y="22" textAnchor="middle" fill="#FFD700" fontSize="7" fontWeight="bold" fontFamily="serif">DRDO</text>
      <path d="M14 28 Q24 34 34 28" stroke="#FFD700" strokeWidth="1.5" fill="none"/>
      <text x="24" y="38" textAnchor="middle" fill="#FFD700" fontSize="4">DEFENCE R&amp;D</text>
    </svg>
  );
}

// ── Calendar Icon SVG ────────────────────────────────────────────────────────
function CalendarIcon() {
  return (
    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor"/>
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeLinecap="round"/>
    </svg>
  );
}

// ── Resource Icons ───────────────────────────────────────────────────────────
function DocIcon() {
  return (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor"/>
      <polyline points="14 2 14 8 20 8" stroke="currentColor"/>
      <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeLinecap="round"/>
      <line x1="9" y1="17" x2="13" y2="17" stroke="currentColor" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor"/>
      <polyline points="8 12 11 15 16 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor"/>
    </svg>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const jobs = await fetchJobs();
  const stats = await fetchJobStats();
  const exams = await fetchUpcomingExams();

  const jobRows = [
    { Logo: SscLogo,       title: "SSC CGL 2024",                  sub: "Hyderabad | 8,500+ Vacancies | Technical" },
    { Logo: RailwaysLogo,  title: "Indian Railways Apprentice Jobs", sub: "Across India | 4,500+ Vacancies | Apprenticeship" },
    { Logo: UpscLogo,      title: "UPSC Civil Services Exam 2024",  sub: "Teaching Posts | Apprenticeship" },
    { Logo: DrdoLogo,      title: "DRDO Technical Assistant Jobs",  sub: "Mumbai | Full-Time | Vacancies" },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#dce6f5] overflow-hidden">
      <DashboardHeader />

      <main className="flex-1 overflow-hidden px-5 pt-3 pb-2 flex flex-col gap-2.5">

        {/* ── Welcome Title ── */}
        <h1 className="text-center text-[1.6rem] font-extrabold text-blue-900 leading-tight tracking-tight">
          Welcome, Student! Explore Latest Govt Job Updates
        </h1>

        {/* ── 4 Stat Cards ── */}
        <div className="grid grid-cols-4 gap-3 flex-shrink-0">

          {/* New Govt Jobs */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl px-5 py-4 flex items-center gap-4 shadow-lg">
            <div className="text-4xl">🏛️</div>
            <div className="leading-tight">
              <div className="text-white text-[0.7rem] font-semibold uppercase tracking-wide">New Govt Jobs</div>
              <div className="text-white text-[0.7rem] font-semibold uppercase tracking-wide">Today:</div>
              <div className="text-white text-4xl font-black leading-none mt-0.5">{stats.total || 85}</div>
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl px-5 py-4 flex items-center gap-4 shadow-lg">
            <div className="text-4xl">📅</div>
            <div className="leading-tight">
              <div className="text-white text-[0.7rem] font-semibold uppercase tracking-wide">Upcoming</div>
              <div className="text-white text-[0.7rem] font-semibold uppercase tracking-wide">Exams:</div>
              <div className="text-white text-4xl font-black leading-none mt-0.5">{stats.upcomingExams || 18}</div>
            </div>
          </div>

          {/* Org Logos card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl px-5 py-4 flex items-center justify-center gap-2 shadow-lg">
            {[SscLogo, RailwaysLogo, UpscLogo, DrdoLogo].map((Logo, i) => (
              <div key={i} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/60 flex-shrink-0">
                <Logo />
              </div>
            ))}
          </div>

          {/* Top Companies Hiring */}
          <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-xl px-5 py-4 flex items-center gap-3 shadow-lg">
            <div className="bg-white rounded-md px-2.5 py-1 flex-shrink-0">
              <span className="text-blue-800 font-extrabold text-base tracking-tight">SSCI</span>
            </div>
            <div className="leading-tight">
              <div className="text-white text-sm font-bold">Top Companies Hiring</div>
              <div className="text-blue-200 text-xs mt-1 font-medium">
                Army &nbsp;<span className="text-orange-300 font-bold">SBI</span>&nbsp;|&nbsp;<span className="text-white font-bold">SBI</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3-Column Content ── */}
        <div className="flex-1 grid grid-cols-3 gap-3 overflow-hidden min-h-0">

          {/* ── COL 1: Job Notifications ── */}
          <div className="bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
            <div className="bg-blue-700 text-white px-4 py-2.5 text-sm font-bold tracking-wide flex-shrink-0">
              Latest Govt Job Notifications
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {jobRows.map(({ Logo, title, sub }, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5 hover:bg-blue-50 transition-colors">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                    <Logo />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[0.82rem] text-gray-900 leading-tight">{title}</div>
                    <div className="text-[0.72rem] text-gray-500 mt-0.5">{sub}</div>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-3.5 py-1.5 rounded-md text-xs font-bold flex-shrink-0 transition-all shadow-sm">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t bg-gray-50 flex-shrink-0 text-center">
              <a href="/jobs" className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm">
                View All Govt Jobs &rsaquo;
              </a>
            </div>
          </div>

          {/* ── COL 2: Upcoming Exams + Ad slot ── */}
          <div className="flex flex-col gap-2.5 overflow-hidden min-h-0">

            <div className="bg-white rounded-xl shadow-md flex flex-col flex-shrink-0">
              {/* Header */}
              <div className="px-4 pt-3 pb-1 flex items-center justify-between flex-shrink-0">
                <h3 className="font-extrabold text-gray-900 text-base">Upcoming Exams</h3>
                <a href="#" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-0.5">
                  View All &rsaquo;
                </a>
              </div>
              <div className="px-4 pb-2 text-[0.7rem] text-gray-400 italic flex-shrink-0">
                UPSC Prelims in May 1st
              </div>

              {/* Exam rows */}
              <div className="px-4 pb-2 space-y-2">
                {[
                  { name: "UPSC Prelims",    date: "May 12ᵗʰ", sub: "7,500+ Vacancies | Full-Time" },
                  { name: "IBPS PO Prelims", date: "May 21ˢᵗ", sub: "2,500+ Vacancies | Current" },
                  { name: "SSC CHSL Tier 1", date: "May 28ᵗʰ", sub: "2,500+ Vacancies | Full-Time" },
                ].map((exam) => (
                  <div key={exam.name} className="flex items-start gap-2.5 border border-gray-200 rounded-lg px-3 py-2.5 hover:border-blue-300 transition-colors">
                    <CalendarIcon />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[0.82rem] text-blue-700 leading-tight">{exam.name}</span>
                        <span className="text-gray-500 text-[0.72rem] flex-shrink-0 font-medium">{exam.date}</span>
                      </div>
                      <div className="text-[0.7rem] text-gray-500 mt-0.5">{exam.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-3 flex-shrink-0">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                  View Exam Calendar &rsaquo;
                </button>
              </div>
            </div>

            {/* Ad slot – empty div for Google AdSense script injection */}
            <div className="bg-white rounded-xl shadow-md flex-1 flex items-center justify-center border border-dashed border-gray-300 min-h-0">
              <div id="ad-slot-middle" className="w-full h-full" />
            </div>
          </div>

          {/* ── COL 3: Ad slot + Resources + Ad slot ── */}
          <div className="flex flex-col gap-2.5 overflow-hidden min-h-0">

            {/* Ad slot top */}
            <div className="bg-white rounded-xl shadow-md flex-1 flex items-center justify-center border border-dashed border-gray-300 min-h-0">
              <div id="ad-slot-top-right" className="w-full h-full" />
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-md px-4 py-3 flex-shrink-0">
              <h3 className="font-extrabold text-gray-900 text-base mb-1.5">Resources</h3>
              <div className="divide-y divide-gray-100">
                {[
                  { Icon: DocIcon,   label: "Exam Syllabus PDFs" },
                  { Icon: CheckIcon, label: "Practice Mock Tests" },
                  { Icon: ChatIcon,  label: "Interview Tips" },
                ].map(({ Icon, label }) => (
                  <a key={label} href="#" className="flex items-center justify-between py-2.5 hover:bg-blue-50 px-1 rounded-md group transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Icon />
                      <span className="text-[0.82rem] font-semibold text-gray-800 group-hover:text-blue-700">{label}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Ad slot bottom */}
            <div className="bg-white rounded-xl shadow-md flex-1 flex items-center justify-center border border-dashed border-gray-300 min-h-0">
              <div id="ad-slot-bottom-right" className="w-full h-full" />
            </div>
          </div>

        </div>
      </main>

      {/* ── News Ticker ── */}
      <div className="bg-blue-900 text-white flex items-center flex-shrink-0 overflow-hidden" style={{minHeight: '2.6rem'}}>
        <div className="bg-orange-500 h-full flex items-center px-4 flex-shrink-0 self-stretch">
          <span className="text-white font-extrabold text-sm tracking-wide whitespace-nowrap">JOB NEWS:</span>
        </div>
        <div className="flex-1 overflow-hidden px-3">
          <span className="animate-marquee text-[0.85rem] text-yellow-100 font-medium whitespace-nowrap">
            SSC releases notification for 7,500 vacancies &nbsp;|&nbsp; Indian Railways announces apprenticeship recruitment &nbsp;|&nbsp; UPSC Civil Services 2025 notification out — Apply before deadline &nbsp;|&nbsp; DRDO Technical Assistant recruitment open &nbsp;|&nbsp; SBI PO 2025 applications now live
          </span>
        </div>
      </div>
    </div>
  );
}