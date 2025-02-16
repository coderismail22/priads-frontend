import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/Loader/Loader";

const fetchTeacherById = async (teacherId: string) => {
  const response = await axiosInstance.get(`/teachers/${teacherId}`);
  return response.data.data;
};

const FullTeacherInfo = () => {
  const { teacherId } = useParams<{ teacherId: string }>();

  const {
    data: teacher,
    isLoading,
    error,
    // TODO: Add type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useQuery<any>({
    queryKey: ["teacher", teacherId],
    queryFn: () => fetchTeacherById(teacherId!),
    enabled: !!teacherId,
  });

  if (isLoading) return <Loader />;
  if (error)
    return (
      <p className="text-center text-red-500">Error fetching teacher data!</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 underline underline-offset-8">
        Full Teacher Info
      </h1>

      {/* Profile Image */}
      <div className="flex flex-col items-center justify-center">
        <img
          src={teacher?.profileImg || "https://via.placeholder.com/150"}
          alt="Teacher Profile"
          className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
        />
      </div>
      <div className="flex flex-row items-center md:items-start gap-8">
        {/* Teacher Details */}
        <div className="flex-1 space-y-4 ">
          <DetailRow label="Name" value={teacher?.name} />
          <DetailRow label="Teacher ID" value={teacher?.teacherId} />
          <DetailRow label="Date of Birth" value={teacher?.dob} />
          <DetailRow label="Teacher ID" value={teacher?.subject} />
          <DetailRow label="Phone" value={teacher?.phone} />
          <DetailRow label="Gender" value={teacher?.gender} />
          <DetailRow label="Blood Group" value={teacher?.bloodGroup} />
          <DetailRow label="Designation" value={teacher?.designation} />
          <DetailRow label="Email" value={teacher?.email} />
          <DetailRow label="Address" value={teacher?.address} />
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

export default FullTeacherInfo;
