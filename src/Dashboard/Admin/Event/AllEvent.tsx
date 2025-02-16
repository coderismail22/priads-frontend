import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import EventTable from "./EventTable";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { eventColumns } from "./eventColumns";
import Loader from "@/components/Loader/Loader";

// Fetch events from the API
const fetchEvents = async () => {
  const response = await axiosInstance.get("/event");
  return response.data.data; // Assuming `data` contains the events array
};

// Delete an event by ID
const deleteEvent = async (eventId: string) => {
  await axiosInstance.delete(`/event/${eventId}`);
};

const AllEvent = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch all events
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  // Delete event mutation
  const mutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      Swal.fire("Deleted!", "Event deleted successfully!", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete event.", "error");
    },
  });

  // Handle event deletion
  const handleDelete = (eventId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(eventId);
      }
    });
  };

  // Handle event editing
  const handleEdit = (eventId: string) => {
    navigate(`/dashboard/admin/edit-event/${eventId}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        All Events
      </h1>
      <div className="my-4 flex justify-end">
        <Button
          onClick={() => navigate("/dashboard/admin/publish-event")}
          className="bg-gradient-to-tr from-[#6a82fb] to-[#fc5c7d]  hover:from-[#fc5c7d] hover:to-[#6a82fb]"
        >
          Publish Event
        </Button>
      </div>
      {events && (
        <EventTable
          data={events}
          columns={eventColumns(handleEdit, handleDelete)}
        />
      )}
    </div>
  );
};

export default AllEvent;
