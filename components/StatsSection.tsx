type StatsProps = {
  total: number;
  active: number;
};

export default function StatsSection({ total, active }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

      <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
        <p className="text-2xl font-bold text-blue-600">
          {total}+
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Total Jobs
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
        <p className="text-2xl font-bold text-green-600">
          {active}+
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Active Jobs
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
        <p className="text-2xl font-bold text-purple-600">
          320+
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Upcoming Exams
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
        <p className="text-2xl font-bold text-orange-600">
          15+
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Departments
        </p>
      </div>

    </div>
  );
}
