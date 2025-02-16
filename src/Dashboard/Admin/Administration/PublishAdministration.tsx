import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AppSelect from "@/components/CustomForm/AppSelect";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useState } from "react";
import { AxiosError } from "axios";
import { handleAxiosError } from "@/utils/handleAxiosError";

// Create administration function
const publishAdministration = async (adminData: {
  name: string;
  designation: string;
  photo: string;
  category: string;
  linkedIn: string;
  fb: string;
  x: string;
  youtube: string;
}) => {
  const response = await axiosInstance.post(
    "/administration/create-administration",
    adminData
  );
  return response.data;
};

const PublishAdministration = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [photo, setAdminPhoto] = useState("");

  const mutation = useMutation({
    mutationFn: publishAdministration,
    onSuccess: () => {
      Swal.fire(
        "Success!",
        "Administration published successfully!",
        "success"
      );
      queryClient.invalidateQueries({ queryKey: ["administration"] });
      navigate("/dashboard/admin/administration");
    },

    onError: (err: AxiosError) => {
      handleAxiosError(err, "Failed to publish event");
    },
  });

  // TODO: Add a type here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const finalData = {
      ...data,
      photo,
    };
    // console.log(finalData)
    mutation.mutate(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">
        Publish Administration
      </h1>
      <AppForm
        onSubmit={onSubmit}
        defaultValues={{
          name: "",
          designation: "",
          photo: "",
          category: "",
          linkedIn: "",
          fb: "",
          x: "",
          youtube: "",
        }}
        buttonText="Publish"
      >
        <AppInput name="name" label="Name" placeholder="Enter name" />
        <AppInput
          name="designation"
          label="Designation"
          placeholder="Enter designation"
        />
        <div className="text-sm truncate my-4">
          <label className="block font-medium text-black ">Photo</label>
          <ImageUpload setUploadedImageUrl={setAdminPhoto} />
          {photo === "" && (
            <p className="text-red-500 text-sm">Image is required</p>
          )}
        </div>{" "}
        <AppSelect
          name="category"
          label="Category"
          options={[
            { value: "Teacher", label: "Teacher" },
            { value: "Governing Body", label: "Governing Body" },
            { value: "Staff", label: "Staff" },
          ]}
        />
        <AppInput name="linkedIn" label="LinkedIn URL" />
        <AppInput name="fb" label="Facebook URL" />
        <AppInput name="x" label="X URL" />
        <AppInput name="youtube" label="YouTube URL" />
      </AppForm>
    </div>
  );
};

export default PublishAdministration;
