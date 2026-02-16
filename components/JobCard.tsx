type JobProps = {
  title: string;
  department: string;
  location: string;
  last_date: string;
};

export default function JobCard({
  title,
  department,
  location,
  last_date,
}: JobProps) {
  return (
    <div className="bg-white border rounded-xl p-5 hover:shadow-lg transition duration-300">

      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
          Active
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        {department}
      </p>

      <p className="text-sm text-gray-500">
        Location: {location}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm">
          Last Date:{" "}
          <span className="font-medium text-red-500">
            {last_date}
          </span>
        </span>

        <a
          href="#"
          className="text-blue-600 text-sm font-medium"
        >
          View →
        </a>
      </div>
    </div>
  );
}
