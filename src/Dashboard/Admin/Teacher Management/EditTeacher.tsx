import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import AppSelect from "@/components/CustomForm/AppSelect";
import AppInputPassword from "@/components/CustomForm/AppInputPassword";
import Swal from "sweetalert2";
import axiosInstance from "@/api/axiosInstance";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useState } from "react";
import Loader from "@/components/Loader/Loader";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/backendErrorResponse.type";
import { handleAxiosError } from "@/utils/handleAxiosError";
import AppDatePicker from "@/components/CustomForm/AppDatePicker";

// Fetch teacher by ID
const fetchTeacherById = async (teacherId: string) => {
  const response = await axiosInstance.get(`/teachers/${teacherId}`);
  return response.data;
};

// Update teacher function
const updateTeacher = async (
  teacherId: string,
  data: {
    name: string;
    profileImg: string;
    teacherId: string;
    dob: string;
    gender: string;
    designation: string;
    subject: string;
    email: string;
    password: string;
    phone: string;
    bloodGroup: string;
    address: string;
  }
) => {
  const response = await axiosInstance.patch(
    `/users/update-teacher/${teacherId}`,
    data
  );
  return response.data;
};

const EditTeacher = () => {
  const [profileImg, setProfileImg] = useState<string>("");
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch teacher details
  const {
    data: teacher,
    isLoading: isLoadingTeacher,
    error: teacherError,
  } = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: () => fetchTeacherById(teacherId!),
    enabled: !!teacherId,
  });

  // Mutation for updating teacher
  const mutation = useMutation({
    mutationFn: (data: {
      name: string;
      profileImg: string;
      teacherId: string;
      dob: string;
      gender: string;
      designation: string;
      subject: string;
      email: string;
      password: string;
      phone: string;
      bloodGroup: string;
      address: string;
    }) => updateTeacher(teacherId!, data),
    onSuccess: () => {
      Swal.fire("Success!", "Teacher updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      navigate("/dashboard/admin/teacher-management/all-teachers");
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      handleAxiosError(err, "Failed to update teacher");
    },
  });

  const onSubmit = (data: {
    name: string;
    profileImg: string;
    teacherId: string;
    dob: string;
    gender: string;
    designation: string;
    subject: string;
    email: string;
    password: string;
    phone: string;
    bloodGroup: string;
    address: string;
  }) => {
    const finalData = {
      ...data,
      profileImg: profileImg || teacher?.data?.profileImg,
      teacherId: teacher?.data?.email,
    };
    mutation.mutate(finalData);
  };

  if (isLoadingTeacher) return <Loader />;
  if (teacherError) return <p>Something went wrong...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Edit Teacher
      </h1>
      {teacher && (
        <AppForm
          onSubmit={onSubmit}
          defaultValues={{
            name: teacher?.data?.name || "",
            dob: teacher?.data?.dob || "",
            gender: teacher?.data?.gender || "",
            designation: teacher?.data?.designation || "",
            subject: teacher?.data?.subject || "",
            email: teacher?.data?.email || "",
            password: teacher?.data?.password || "",
            address: teacher?.data?.address || "",
            phone: teacher?.data?.phone || "",
            bloodGroup: teacher?.data?.bloodGroup || "",
          }}
          buttonText="Update Teacher"
        >
          <AppInput
            name="name"
            label="Teacher Name"
            placeholder="Enter teacher name"
          />
          <div className="text-sm truncate my-4">
            <label className="block font-medium text-black">
              Upload Cover Image
            </label>
            <ImageUpload setUploadedImageUrl={setProfileImg} />
          </div>
          <AppDatePicker
            name="dob"
            label="Date of Birth"
            placeholder="Select a date"
          />
          <AppSelect
            name="bloodGroup"
            label="Blood Group"
            placeholder="Select a blood group"
            options={[
              { value: "A+", label: "A+" },
              { value: "A-", label: "A-" },
              { value: "B+", label: "B+" },
              { value: "B-", label: "B-" },
              { value: "AB+", label: "AB+" },
              { value: "AB-", label: "AB-" },
              { value: "O+", label: "O+" },
              { value: "O-", label: "O-" },
            ]}
          />
          <AppSelect
            name="gender"
            label="Gender"
            placeholder="Select gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
          />
          <AppInput
            name="designation"
            label="Designation"
            placeholder="Enter designation"
          />
          <AppInput
            name="subject"
            label="Subject"
            placeholder="Enter subject"
          />
          <AppInput
            name="phone"
            label="Phone"
            placeholder="Enter phone number"
          />
          <AppInput name="email" label="Email" placeholder="Enter email" />
          <AppInputPassword
            name="password"
            label="Password"
            placeholder="Enter new password"
          />
          <AppInput
            name="address"
            label="Address"
            placeholder="Enter address"
          />
        </AppForm>
      )}
    </div>
  );
};

export default EditTeacher;
