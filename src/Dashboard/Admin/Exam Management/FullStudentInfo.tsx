import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/Loader/Loader";

const fetchStudentById = async (studentId: string) => {
  const response = await axiosInstance.get(`/students/${studentId}`);
  return response.data.data;
};

const FullStudentInfo = () => {
  const { studentId } = useParams<{ studentId: string }>();

  const {
    data: student,
    isLoading,
    error,
    // TODO: Add type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useQuery<any>({
    queryKey: ["student", studentId],
    queryFn: () => fetchStudentById(studentId!),
    enabled: !!studentId,
  });

  if (isLoading) return <Loader />;
  if (error)
    return (
      <p className="text-center text-red-500">Error fetching student data!</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 underline underline-offset-8">
        Full Student Info
      </h1>

      {/* Profile Image */}
      <div className="flex flex-col items-center justify-center">
        <img
          src={student?.profileImg || "https://via.placeholder.com/150"}
          alt="Student Profile"
          className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
        />
      </div>
      <div className="flex flex-row items-center md:items-start gap-8">
        {/* Student Details */}
        <div className="flex-1 space-y-4 ">
          <DetailRow label="Name" value={student?.name} />
          <DetailRow label="Student ID" value={student?.studentId} />
          <DetailRow label="Email" value={student?.email} />
          <DetailRow label="Phone" value={student?.phone} />
          <DetailRow label="Guardian Name" value={student?.guardianName} />
          <DetailRow label="Address" value={student?.address} />
          <DetailRow label="Blood Group" value={student?.bloodGroup} />
          <DetailRow label="Year" value={student?.year} />
          <DetailRow label="Version" value={student?.version} />
          <DetailRow label="Shift" value={student?.shift} />
          <DetailRow label="Class" value={student?.class} />
          <DetailRow label="Section" value={student?.section} />
          {student?.group && <DetailRow label="Group" value={student?.group} />}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value || "N/A"}</span>
  </div>
);

export default FullStudentInfo;
