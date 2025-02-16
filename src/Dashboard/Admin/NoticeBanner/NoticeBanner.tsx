import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/Loader/Loader";
import { AxiosError } from "axios";
import { handleAxiosError } from "@/utils/handleAxiosError";

// Fetch the existing notice banner from the backend
const fetchNoticeBanner = async () => {
  const response = await axiosInstance.get("/noticebanner");
  if (response.data.data.length > 0) {
    return response.data.data[0]; // Return the first notice banner
  } else {
    // If no notice exists, create a random one on the backend
    const randomBanner = await axiosInstance.post(
      "/noticebanner/create-notice-banner",
      {
        title: `Important Notice - ${Math.floor(Math.random() * 1000)}`,
      }
    );
    return randomBanner.data.data;
  }
};

// Update the existing notice banner by ID
const updateNoticeBanner = async (
  noticeBannerId: string,
  data: { title: string }
) => {
  const response = await axiosInstance.patch(
    `/noticebanner/update-notice-banner/${noticeBannerId}`,
    data
  );
  return response.data;
};

const NoticeBanner = () => {
  const queryClient = useQueryClient();
  const [noticeBannerId, setNoticeBannerId] = useState<string | null>(null);

  // Fetching the notice banner using react-query
  const { data: noticeBanner, isLoading, error } = useQuery({
    queryKey: ["noticeBanner"],
    queryFn: fetchNoticeBanner,
  });

  // ✅ Handling noticeBannerId assignment after data fetch
  useEffect(() => {
    if (noticeBanner && noticeBanner._id) {
      setNoticeBannerId(noticeBanner._id);
    }
  }, [noticeBanner]);

  // Mutation for updating the notice banner
  const updateMutation = useMutation({
    mutationFn: (data: { title: string }) =>
      updateNoticeBanner(noticeBannerId!, data),
    onSuccess: () => {
      Swal.fire("Updated!", "Notice banner updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["noticeBanner"] });
    },
    onError: (err: AxiosError) => {
      handleAxiosError(err, "Failed to update notice banner");
    },
  });

  // Form submission handler with updated ID check
  const onSubmit = (data: { title: string }) => {
    if (!noticeBannerId) {
      Swal.fire("Error!", "No notice banner ID found!", "error");
      return;
    }
    updateMutation.mutate(data);
  };

  if (isLoading) return <Loader />;
  if (error) return <p>Error fetching notice banner!</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Update Notice Banner
      </h1>

      {/* Form for Updating the Notice Banner */}
      {noticeBanner && (
        <AppForm
          onSubmit={onSubmit}
          defaultValues={{ title: noticeBanner.title }}
          buttonText="Update Notice"
        >
          <div className="max-w-2xl mx-auto">
            <AppInput name="title" label="Title" placeholder="Update Notice" />
          </div>
        </AppForm>
      )}
    </div>
  );
};

export default NoticeBanner;
