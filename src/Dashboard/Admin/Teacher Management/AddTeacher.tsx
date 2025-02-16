import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { useState } from "react";
import AppSelect from "@/components/CustomForm/AppSelect";
import AppInputPassword from "@/components/CustomForm/AppInputPassword";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/backendErrorResponse.type";
import { handleAxiosError } from "@/utils/handleAxiosError";
import AppDatePicker from "@/components/CustomForm/AppDatePicker";

// Create teacher function
const createTeacher = async (teacherData: {
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
  const response = await axiosInstance.post(
    "/users/create-teacher",
    teacherData
  );
  return response.data;
};

const AddTeacher = () => {
  const [profileImg, setProfileImg] = useState<string>(""); // Handle batch image

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for creating a teacher
  const mutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      Swal.fire("Success!", "Teacher added successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      navigate("/dashboard/admin/teacher-management/all-teachers");
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      handleAxiosError(err, "Failed to add teacher");
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
      profileImg,
      teacherId: data?.email,
    };

    mutation.mutate(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Add Teacher
      </h1>
      <AppForm
        onSubmit={onSubmit}
        defaultValues={{
          name: "",
          dob: "",
          gender: "",
          designation: "",
          subject: "",
          email: "",
          password: "",
          address: "",
          phone: "",
          bloodGroup: "",
        }}
        buttonText="Add Teacher"
      >
        {/* Teacher Name */}
        <AppInput
          name="name"
          label="Teacher Name"
          placeholder="Enter teacher name"
        />

        {/* Image Upload Section */}
        <div className="text-sm truncate my-4">
          <label className="block font-medium text-black ">
            Upload Cover Image
          </label>
          <ImageUpload setUploadedImageUrl={setProfileImg} />
          {profileImg === "" && (
            <p className="text-red-500 text-sm">Image is required</p>
          )}
        </div>

        {/* DOB */}
        <AppDatePicker
          name="dob"
          label="Date of Birth"
          placeholder="Select a date"
        />

        {/* Blood Group */}
        <AppSelect
          name="bloodGroup"
          label="Blood Group"
          placeholder="Select a blood group"
          options={[
            {
              value: "A+",
              label: "A+",
            },
            {
              value: "A-",
              label: "A-",
            },
            {
              value: "B+",
              label: "B+",
            },
            {
              value: "B-",
              label: "B-",
            },
            {
              value: "AB",
              label: "AB+",
            },
            {
              value: "AB-",
              label: "AB-",
            },
            {
              value: "O+",
              label: "O+",
            },
            {
              value: "O-",
              label: "O-",
            },
          ]}
        />

        {/* Gender */}
        <AppSelect
          name="gender"
          label="Gender"
          placeholder="Select a gender"
          options={[
            {
              value: "Male",
              label: "Male",
            },
            {
              value: "Female",
              label: "Female",
            },
          ]}
        />

        {/* Designation */}
        <AppSelect
          name="designation"
          label="Designation"
          placeholder="Select a designation"
          options={[
            {
              value: "Lecturer",
              label: "Lecturer",
            },
            {
              value: "Assistant Teacher",
              label: "Assistant Teacher",
            },
          ]}
        />

        {/* Subject */}
        <AppInput
          name="subject"
          label="Subject"
          placeholder="Enter subject name"
        />

        {/* Phone */}
        <AppInput
          name="phone"
          label="Phone Number"
          placeholder="Enter phone number"
        />

        {/* Email */}
        <AppInput name="email" label="Email" placeholder="Enter email" />

        {/* Password */}
        <AppInputPassword
          className="w-full mb-4 bg-white border border-blue-400 text-black placeholder-gray-500 focus:ring focus:ring-blue-500 focus:border-blue-500"
          name="password"
          label="Password"
          labelStyles="text-black"
          placeholder="Enter your password"
        />

        {/* Address */}
        <AppInput name="address" label="Address" placeholder="Enter Address" />
      </AppForm>
    </div>
  );
};

export default AddTeacher;
