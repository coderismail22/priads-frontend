import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/Loader/Loader";
import AppSelect from "@/components/CustomForm/AppSelect";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useState } from "react";

// Define TypeScript type for administration data
interface IAdministration {
  name: string;
  designation: string;
  photo: string;
  category: "Teacher" | "Governing Body" | "Staff";
  linkedIn: string;
  fb: string;
  x: string;
  youtube: string;
}

// Fetch administration by ID
const fetchAdministrationById = async (
  adminId: string
): Promise<{ data: IAdministration }> => {
  const response = await axiosInstance.get(`/administration/${adminId}`);
  return response.data;
};

// Update administration function
const updateAdministration = async (
  adminId: string,
  data: Partial<IAdministration>
): Promise<IAdministration> => {
  const response = await axiosInstance.patch(
    `/administration/update-administration/${adminId}`,
    data
  );
  return response.data;
};

const EditAdministration = () => {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [photo, setPhoto] = useState<string>("");

  // Fetch administration details
  const {
    data: administration,
    isLoading,
    error,
  } = useQuery<{ data: IAdministration }>({
    queryKey: ["administration", adminId],
    queryFn: () => fetchAdministrationById(adminId!),
    enabled: !!adminId,
  });

  // Mutation for updating the administration
  const mutation = useMutation({
    mutationFn: (data: Partial<IAdministration>) =>
      updateAdministration(adminId!, data),
    onSuccess: () => {
      Swal.fire("Success!", "Administration updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["administration"] });
      navigate("/dashboard/admin/administration");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to update administration.", "error");
    },
  });

  // Form submission handler with Type Safety
  const onSubmit = (data: Partial<IAdministration>) => {
    const finalData: Partial<IAdministration> = {
      ...data,
      photo: photo || administration?.data.photo,
    };
    mutation.mutate(finalData);
  };

  if (isLoading) return <Loader />;
  if (error) return <p>Error loading administration details.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Edit Administration
      </h1>
      {administration && (
        <AppForm
          onSubmit={onSubmit}
          defaultValues={administration?.data}
          buttonText="Update"
        >
          <AppInput name="name" label="Name" placeholder="Enter name" />
          <AppInput
            name="designation"
            label="Designation"
            placeholder="Enter designation"
          />

          {/* Image Upload Section */}
          <div className="text-sm truncate my-4">
            <label className="block font-medium text-black">Upload Photo</label>
            <ImageUpload setUploadedImageUrl={setPhoto} />
          </div>

          <AppSelect
            name="category"
            label="Category"
            options={[
              { value: "Teacher", label: "Teacher" },
              { value: "Governing Body", label: "Governing Body" },
              { value: "Staff", label: "Staff" },
            ]}
          />

          <AppInput
            name="linkedIn"
            label="LinkedIn URL"
            placeholder="Enter LinkedIn URL"
          />
          <AppInput
            name="fb"
            label="Facebook URL"
            placeholder="Enter Facebook URL"
          />
          <AppInput name="x" label="X URL" placeholder="Enter X URL" />
          <AppInput
            name="youtube"
            label="YouTube URL"
            placeholder="Enter YouTube URL"
          />
        </AppForm>
      )}
    </div>
  );
};

export default EditAdministration;
