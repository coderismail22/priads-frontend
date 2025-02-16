import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AdministrationTable from "./AdministrationTable";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { administrationColumns } from "./administrationColumns";
import Loader from "@/components/Loader/Loader";

const fetchAdministrations = async () => {
  const response = await axiosInstance.get("/administration");
  return response.data.data;
};

const deleteAdministration = async (adminId: string) => {
  await axiosInstance.delete(`/administration/${adminId}`);
};

const AllAdministration = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: administrations, isLoading } = useQuery({
    queryKey: ["administration"],
    queryFn: fetchAdministrations,
  });

  const mutation = useMutation({
    mutationFn: deleteAdministration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["administration"] });
      Swal.fire("Deleted!", "Administration deleted successfully!", "success");
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    console.log('id',id)
    navigate(`/dashboard/admin/edit-administration/${id}`);
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        All Administrations
      </h1>
      <div className="my-4 flex justify-end">
        <Button
          onClick={() => navigate("/dashboard/admin/publish-administration")}
          className="bg-gradient-to-tr from-[#6a82fb] to-[#fc5c7d]  hover:from-[#fc5c7d] hover:to-[#6a82fb]"
        >
          Add Administration
        </Button>
      </div>
      {administrations && (
        <AdministrationTable
          data={administrations}
          columns={administrationColumns(handleEdit, handleDelete)}
        />
      )}
    </div>
  );
};

export default AllAdministration;
