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
    <div className="border rounded-lg p-4 hover:shadow">
      <h3 className="font-semibold text-lg">{title}</h3>

      <p className="text-sm text-gray-600">
        {department} • {location}
      </p>

      <p className="text-sm mt-2">
        Last Date: <span className="font-medium">{last_date}</span>
      </p>

      <a
        href="#"
        className="inline-block mt-3 text-blue-600 text-sm font-medium"
      >
        View Details →
      </a>
    </div>
  );
}
