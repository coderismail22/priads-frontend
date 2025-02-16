import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import Loader from "@/components/Loader/Loader";
import AppDatePicker from "@/components/CustomForm/AppDatePicker";
import Select from "react-select";
import { useState } from "react";

// Fetch event by ID
const fetchEventById = async (eventId: string) => {
  const response = await axiosInstance.get(`/event/${eventId}`);
  return response?.data;
};

// Update event function
const updateEvent = async (
  eventId: string,
  data: {
    title: string;
    description: string;
    date: string;
    category: string;
    imageUrl: string;
    videoUrl: string;
    type: "ended" | "upcoming";
  }
) => {
  const response = await axiosInstance.patch(
    `/event/update-event/${eventId}`,
    data
  );
  return response?.data;
};

const EditEvent = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    category: "",
    type: "",
  });

  // Fetch event details
  const {
    data: event,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => fetchEventById(eventId!),
    enabled: !!eventId,
  });

  const mutation = useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      date: string;
      category: string;
      imageUrl: string;
      videoUrl: string;
      type: "ended" | "upcoming";
    }) => updateEvent(eventId!, data),
    onSuccess: () => {
      Swal.fire("Updated!", "Event updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/dashboard/admin/event");
    },
    onError: (error) => {
      console.log(error);
      Swal.fire("Error!", "Failed to update event.", "error");
    },
  });

  const onSubmit = (data: {
    title: string;
    description: string;
    date: string;
    imageUrl: string;
    videoUrl: string;
  }) => {
    const finalData = {
      ...data,
      category: formData.category,
      type: formData.type as "ended" | "upcoming",
    };
    mutation.mutate(finalData);
  };

  if (isLoadingEvent) {
    return <Loader />;
  }
  if (eventError) return <p>Something went wrong...</p>;

  const categoryOptions = [
    { value: "video", label: "Video" },
    { value: "photo", label: "Photo" },
  ];

  const typeOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "ended", label: "Ended" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Edit Event
      </h1>
      {event && (
        <AppForm
          onSubmit={onSubmit}
          defaultValues={{
            ...event?.data,
          }}
          buttonText="Update Event"
        >
          {/* Title */}
          <div className="mb-2">
            <AppInput
              name="title"
              label="Title"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div className="mb-2">
            <AppInput
              name="description"
              label="Description"
              placeholder="Enter event description"
            />
          </div>

          {/* Event Date */}
          <AppDatePicker
            name="date"
            label="Event Date"
            placeholder="Enter event date"
          />

          {/* Category */}
          <div className="mb-4">
            <label className="block font-medium text-black mb-2">
              Category
            </label>
            <Select
              options={categoryOptions}
              placeholder="Select event category"
              value={categoryOptions.find(
                (option) => option.value === formData.category
              )}
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  category: selectedOption?.value || "",
                }))
              }
            />
          </div>

          {/* Conditional Inputs */}
          {formData.category === "video" && (
            <div className="my-2">
              <AppInput
                name="videoUrl"
                label="Video URL"
                placeholder="Enter video URL"
              />
            </div>
          )}

          {formData.category === "photo" && (
            <div className="text-sm truncate my-4">
              <label className="block font-medium text-black ">
                Upload Event Image
              </label>
              <AppInput
                name="imageUrl"
                label="Image URL"
                placeholder="Enter image URL"
              />
            </div>
          )}

          {/* Event Type */}
          <div className="mb-4">
            <label className="block font-medium text-black mb-2">Type</label>
            <Select
              options={typeOptions}
              placeholder="Select event type"
              value={typeOptions.find(
                (option) => option.value === formData.type
              )}
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  type: selectedOption?.value || "",
                }))
              }
            />
          </div>
        </AppForm>
      )}
    </div>
  );
};

export default EditEvent;
