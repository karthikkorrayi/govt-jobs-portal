type StatsProps = {
  total: number;
  active: number;
  upcomingExams: number;
};

export default function StatsSection({
  total,
  active,
  upcomingExams,
}: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

      <StatCard number={total} label="Total Jobs" color="blue" />
      <StatCard number={active} label="Active Jobs" color="green" />
      <StatCard number={upcomingExams} label="Upcoming Exams" color="purple" />
      <StatCard number={15} label="Departments" color="orange" />

    </div>
  );
}

function StatCard({
  number,
  label,
  color,
}: {
  number: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
      <p className={`text-2xl font-bold text-purple-600`}>
        {number}+
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {label}
      </p>
    </div>
  );
}