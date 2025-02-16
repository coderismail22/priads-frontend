import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/Loader/Loader";

interface Student {
  name: string;
  dob: string;
  birthRegId: string;
  bloodGroup: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  year: string;
  class: string;
  section: string;
  group?: string;
  version: string;
  shift: string;
  roll: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  profileImg?: string;
}

const fetchStudentById = async (studentId: string) => {
  const response = await axiosInstance.get(`/students/${studentId}`);
  return response.data.data as Student;
};

const FullStudentInfo = () => {
  const { studentId } = useParams<{ studentId: string }>();

  const { data: student, isLoading, error } = useQuery<Student>({
    queryKey: ["student", studentId],
    queryFn: () => fetchStudentById(studentId!),
    enabled: !!studentId,
  });

  if (isLoading) return <Loader />;
  if (error)
    return <p className="text-center text-red-500">Error fetching student data!</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 underline underline-offset-8">
        Full Student Info
      </h1>

      {/* Profile Image */}
      <div className="flex flex-col items-center justify-center mb-6">
        <img
          src={student?.profileImg || "https://via.placeholder.com/150"}
          alt="Student Profile"
          className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
        />
      </div>
      
      {/* Student Details */}
      <div className="space-y-4">
        <DetailRow label="Name" value={student?.name} />
        <DetailRow label="Date of Birth" value={student?.dob} />
        <DetailRow label="Birth Registration ID" value={student?.birthRegId} />
        <DetailRow label="Gender" value={student?.gender} />
        <DetailRow label="Roll" value={student?.roll} />
        <DetailRow label="Email" value={student?.email} />
        <DetailRow label="Phone" value={student?.phone} />
        <DetailRow label="Address" value={student?.address} />
        <DetailRow label="Blood Group" value={student?.bloodGroup} />
        <DetailRow label="Year" value={student?.year} />
        <DetailRow label="Class" value={student?.class} />
        <DetailRow label="Section" value={student?.section} />
        {student?.group && <DetailRow label="Group" value={student?.group} />}
        <DetailRow label="Version" value={student?.version} />
        <DetailRow label="Shift" value={student?.shift} />
        <DetailRow label="Father's Name" value={student?.fatherName} />
        <DetailRow label="Father's Phone" value={student?.fatherPhone} />
        <DetailRow label="Mother's Name" value={student?.motherName} />
        <DetailRow label="Mother's Phone" value={student?.motherPhone} />
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value || "N/A"}</span>
  </div>
);

export default FullStudentInfo;
