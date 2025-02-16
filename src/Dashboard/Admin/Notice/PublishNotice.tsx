import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AppSelect from "@/components/CustomForm/AppSelect";
import AppDatePicker from "@/components/CustomForm/AppDatePicker";

// Create teacher function
const publishNotice = async (teacherData: {
  title: string;
  publishDate: string;
  category: string;
  noticePdfUrl: string;
}) => {
  const response = await axiosInstance.post(
    "/notice/publish-notice",
    teacherData
  );
  return response.data;
};

const PublishNotice = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for creating a teacher
  const mutation = useMutation({
    mutationFn: publishNotice,
    onSuccess: () => {
      Swal.fire("Success!", "Notice published successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["notice"] });
      navigate("/dashboard/admin/notice");
    },
    onError: (err) => {
      console.error(err);
      Swal.fire(
        "Error!",
        "Failed to publish notice. Please try again.",
        "error"
      );
    },
  });

  const onSubmit = (data: {
    title: string;
    publishDate: string;
    category: string;
    noticePdfUrl: string;
  }) => {
    const finalData = {
      ...data,
    };

    mutation.mutate(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Publish Notice
      </h1>

      <AppForm
        onSubmit={onSubmit}
        defaultValues={{
          title: "",
          publishDate: "",
          category: "",
          noticePdfUrl: "",
        }}
        buttonText="Publish"
      >
        {/* Title */}
        <div className="mb-2">
          <AppInput
            name="title"
            label="Title"
            placeholder="Enter notice title"
          />
        </div>

        {/* Notice Category */}
        <AppSelect
          name="category"
          label="Category"
          placeholder="Select notice category"
          options={[
            {
              value: "General",
              label: "General",
            },
            {
              value: "Event",
              label: "Update",
            },
            {
              value: "Exam",
              label: "Exam",
            },
            {
              value: "Other",
              label: "Other",
            },
          ]}
        />

        {/* PDF URL */}
        <div className="my-2">
          <AppInput
            name="noticePdfUrl"
            label="Notice File URL"
            placeholder="Enter notice file URL"
          />
        </div>

        {/* Publish Date */}
        <AppDatePicker
          name="publishDate"
          label="Notice Date"
          placeholder="Enter notice date"
        />
      </AppForm>
    </div>
  );
};

export default PublishNotice;
