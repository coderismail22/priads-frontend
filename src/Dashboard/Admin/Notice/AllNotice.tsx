import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import NoticeTable from "./NoticeTable";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { noticeColumns } from "./noticeColumns";
import Loader from "@/components/Loader/Loader";

// Fetch notices from the API
const fetchNotices = async () => {
  const response = await axiosInstance.get("/notice");
  return response.data.data; // Assuming `data` contains the notices array
};

// Delete a notice by ID
const deleteNotice = async (noticeId: string) => {
  await axiosInstance.delete(`/notice/${noticeId}`);
};

const AllNotice = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch all notices
  const { data: notices, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchNotices,
  });

  // Delete notice mutation
  const mutation = useMutation({
    mutationFn: deleteNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      Swal.fire("Deleted!", "Notice deleted successfully!", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete notice.", "error");
    },
  });

  // Handle notice deletion
  const handleDelete = (noticeId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(noticeId);
      }
    });
  };

  // Handle notice editing
  const handleEdit = (noticeId: string) => {
    navigate(`/dashboard/admin/edit-notice/${noticeId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        All Notices
      </h1>
      <div className="my-4 flex justify-end">
        <Button
          onClick={() => navigate("/dashboard/admin/publish-notice")}
          className="bg-gradient-to-tr from-[#6a82fb] to-[#fc5c7d]  hover:from-[#fc5c7d] hover:to-[#6a82fb]"
        >
          Publish Notice
        </Button>
      </div>
      {notices && (
        <NoticeTable
          data={notices}
          columns={noticeColumns(handleEdit, handleDelete)}
        />
      )}
    </div>
  );
};

export default AllNotice;
