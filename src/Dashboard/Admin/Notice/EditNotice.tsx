import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/Loader/Loader";
import AppDatePicker from "@/components/CustomForm/AppDatePicker";
import AppSelect from "@/components/CustomForm/AppSelect";

// Fetch notice by ID
const fetchNoticeById = async (noticeId: string) => {
  const response = await axiosInstance.get(`/notice/${noticeId}`);
  console.log("notice", response?.data);
  return response?.data;
};

// Update notice function
const updateNotice = async (
  noticeId: string,
  data: {
    title: string;
    publishDate: string;
    category: string;
    noticePdfUrl: string;
  }
) => {
  const response = await axiosInstance.patch(
    `/notice/update-notice/${noticeId}`,
    data
  );
  return response?.data;
};

const EditNotice = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch notice details
  const {
    data: notice,
    isLoading: isLoadingNotice,
    error: noticeError,
  } = useQuery({
    queryKey: ["notice", noticeId],
    queryFn: () => fetchNoticeById(noticeId!),
    enabled: !!noticeId,
  });

  const mutation = useMutation({
    mutationFn: (data: {
      title: string;
      publishDate: string;
      category: string;
      noticePdfUrl: string;
    }) => updateNotice(noticeId!, data),
    onSuccess: () => {
      Swal.fire("Updated!", "Notice updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      navigate("/dashboard/admin/notice");
    },
    onError: (error) => {
      console.log(error);
      Swal.fire("Error!", "Failed to update notice.", "error");
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

  if (isLoadingNotice) {
    return <Loader />;
  }
  if (noticeError) return <p>Something went wrong...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Edit Notice
      </h1>
      {notice && (
        <AppForm
          onSubmit={onSubmit}
          defaultValues={{
            ...notice?.data,
          }}
          buttonText="Update Notice"
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
      )}
    </div>
  );
};

export default EditNotice;
