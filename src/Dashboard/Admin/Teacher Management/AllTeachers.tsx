import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import TeacherTable from "./TeacherTable";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { teacherColumns } from "./teacherColumns";
import Loader from "@/components/Loader/Loader";
import { handleAxiosError } from "@/utils/handleAxiosError";

// Fetch teachers from the API
const fetchTeachers = async () => {
  const response = await axiosInstance.get("/teachers");
  return response.data.data; // Assuming `data` contains the teachers array
};

// Delete a teacher by ID
const deleteTeacher = async (teacherId: string) => {
  await axiosInstance.delete(`/users/delete-teacher/${teacherId}`);
};

const AllTeachers = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch all teachers
  const { data: teachers, isLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  // Delete teacher mutation
  const mutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      Swal.fire("Deleted!", "Teacher deleted successfully!", "success");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      handleAxiosError(error, "Failed to delete teacher.");
    },
  });

  // Handle teacher deletion
  const handleDelete = (teacherId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete teacher!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(teacherId);
      }
    });
  };

  // Handle teacher editing
  const handleEdit = (teacherId: string) => {
    navigate(`/dashboard/admin/teacher-management/edit-teacher/${teacherId}`);
  };

  const handleTeacherFullInfo = (teacherId: string) => {
    navigate(
      `/dashboard/admin/teacher-management/full-teacher-info/${teacherId}`
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        All Teachers
      </h1>
      <div className="my-4 flex justify-end">
        <Button
          onClick={() =>
            navigate("/dashboard/admin/teacher-management/create-teacher")
          }
          className="bg-gradient-to-tr from-[#6a82fb] to-[#fc5c7d]  hover:from-[#fc5c7d] hover:to-[#6a82fb]"
        >
          Add Teacher
        </Button>
      </div>
      {teachers && (
        <TeacherTable
          data={teachers}
          columns={teacherColumns(
            handleTeacherFullInfo,
            handleEdit,
            handleDelete
          )}
        />
      )}
    </div>
  );
};

export default AllTeachers;
