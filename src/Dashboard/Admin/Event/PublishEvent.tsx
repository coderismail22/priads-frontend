import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AppDatePicker from "@/components/CustomForm/AppDatePicker";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useState } from "react";
import Select from "react-select";
import { AxiosError } from "axios";
import { handleAxiosError } from "@/utils/handleAxiosError";

// Create event function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const publishEvent = async (eventData: any) => {
  const response = await axiosInstance.post("/event/publish-event", eventData);
  return response.data;
};

const PublishEvent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [eventImg, setEventImg] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  // Mutation for creating an event
  const mutation = useMutation({
    mutationFn: publishEvent,
    onSuccess: () => {
      Swal.fire("Success!", "Event published successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["event"] });
      navigate("/dashboard/admin/event");
    },
    onError: (err: AxiosError) => {
      handleAxiosError(err, "Failed to publish event");
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const finalData = {
      ...data,
      imageUrl: eventImg,
      category,
      type,
    };

    mutation.mutate(finalData);
    // console.log(finalData);
  };

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
        Publish Event
      </h1>
      <AppForm
        onSubmit={onSubmit}
        defaultValues={{
          title: "",
          description: "",
          date: "",
          category: "",
          videoUrl: "",
          type: "",
        }}
        buttonText="Publish"
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
          placeholder="Select event date"
        />

        {/* Category */}
        <div className="mb-4">
          <label className="block font-medium text-black mb-2">Category</label>
          <Select
            options={categoryOptions}
            placeholder="Select event category"
            onChange={(selectedOption) => {
              setCategory(selectedOption?.value || "");
            }}
          />
        </div>

        {/* Conditional Input */}
        {category === "video" && (
          <div className="my-2">
            <AppInput
              name="videoUrl"
              label="YouTube Video URL"
              placeholder="Enter video URL"
            />
          </div>
        )}

        {category === "photo" && (
          <div className="text-sm truncate my-4">
            <label className="block font-medium text-black ">
              Upload Event Image
            </label>
            <ImageUpload setUploadedImageUrl={setEventImg} />
            {eventImg === "" && (
              <p className="text-red-500 text-sm">Image is required</p>
            )}
          </div>
        )}

        {/* Event Type */}
        <div className="mb-4">
          <label className="block font-medium text-black mb-2">Type</label>
          <Select
            options={typeOptions}
            placeholder="Select event type"
            onChange={(selectedOption) => {
              setType(selectedOption?.value || "");
            }}
          />
        </div>
      </AppForm>
    </div>
  );
};

export default PublishEvent;
