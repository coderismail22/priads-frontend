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
import AppYearPicker from "@/components/CustomForm/AppYearPicker";
import "../../../../styles/swal.css";
import AppDatePicker from "@/components/CustomForm/AppDatePicker";
// Register student function
const registerStudent = async (studentData: {
  name: string;
  dob: string;
  profileImg: string;
  birthRegId: string;
  bloodGroup: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  class: string;
  section: string;
  group: string;
  year: string;
  version: string;
  shift: string;
  roll: string;
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherPhone: string;
  password: string;
}) => {
  const response = await axiosInstance.post(
    "/users/register-student",
    studentData
  );
  return response.data;
};

const RegisterStudent = () => {
  const [profileImg, setProfileImg] = useState<string>(""); // Handle profile image

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for registering a student
  const mutation = useMutation({
    mutationFn: registerStudent,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Student registered successfully!",
        customClass: {
          title: "custom-title",
          popup: "custom-popup",
          icon: "custom-icon",
          confirmButton: "custom-confirm-btn",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate("/dashboard/admin/student-management/register-student");
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      console.log(err);
      handleAxiosError(err, "Failed to register student");
    },
  });

  const onSubmit = (data: {
    name: string;
    dob: string;
    birthRegId: string;
    bloodGroup: string;
    gender: string;
    phone: string;
    email: string;
    address: string;
    year: string;
    class: string;
    section: string;
    group: string;
    version: string;
    shift: string;
    roll: string;
    fatherName: string;
    fatherPhone: string;
    motherName: string;
    motherPhone: string;
    password: string;
  }) => {
    const finalData = {
      ...data,
      profileImg,
      studentId: data?.birthRegId,
    };

    mutation.mutate(finalData);
    // console.log(finalData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Register Student
      </h1>
      <AppForm
        onSubmit={onSubmit}
        defaultValues={{
          name: "",
          dob: "",
          roll: "",
          gender: "",
          password: "",
          bloodGroup: "",
          year: "",
          version: "",
          shift: "",
          class: "",
          section: "",
          group: "",
          phone: "",
          email: "",
          address: "",
          fatherName: "",
          fatherPhone: "",
          motherName: "",
          motherPhone: "",
        }}
        buttonText="Register Student"
      >
        {/* Student Name */}
        <AppInput
          name="name"
          label="Student Name"
          placeholder="Enter student name"
        />

        {/* Image Upload Section */}
        <div className="text-sm truncate my-4">
          <label className="block font-medium text-black ">
            Upload Profile Image
          </label>
          <ImageUpload setUploadedImageUrl={setProfileImg} />
          {profileImg === "" && (
            <p className="text-red-500 text-sm">Image is required</p>
          )}
        </div>

        {/* Date of Birth */}
        <AppDatePicker
          name="dob"
          label="Date of Birth"
          placeholder="Enter date of birth"
        />
        {/* Birth Registration Number */}
        <AppInput
          name="birthRegId"
          label="Birth Registration Number"
          placeholder="Enter birth registration number"
        />

        {/* Blood Group */}
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

        {/* Phone */}
        <AppInput name="phone" label="Phone" placeholder="Enter phone number" />

        {/* Year Picker */}
        <AppYearPicker name="year" label="Year" />

        {/* Class */}
        <AppSelect
          name="class"
          label="Class"
          placeholder="Select a class"
          options={[
            { value: "7", label: "Seven" },
            { value: "8", label: "Eight" },
            { value: "9", label: "Nine" },
            { value: "10", label: "Ten" },
          ]}
        />

        {/* Section */}
        <AppSelect
          name="section"
          label="Section"
          placeholder="Select a section"
          options={[
            { value: "A", label: "A" },
            { value: "B", label: "B" },
            { value: "C", label: "C" },
            { value: "D", label: "D" },
          ]}
        />

        {/* Group (Optional) */}
        <AppSelect
          name="group"
          label="Group (If Applicable)"
          placeholder="Select a group"
          options={[
            { value: "Science", label: "Science" },
            { value: "Arts", label: "Arts" },
            { value: "Commerce", label: "Commerce" },
            { value: "NA", label: "NA" },
          ]}
        />

        {/* Version*/}
        <AppSelect
          name="version"
          label="Version"
          placeholder="Select a version"
          options={[
            { value: "Bangla", label: "Bangla" },
            { value: "English", label: "English" },
          ]}
        />

        {/* Shift */}
        <AppSelect
          name="shift"
          label="Shift"
          placeholder="Select a shift"
          options={[
            { value: "Morning", label: "Morning" },
            { value: "Day", label: "Day" },
            { value: "Evening", label: "Evening" },
          ]}
        />

        {/* Roll */}
        <AppInput
          name="roll"
          label="Class Roll"
          placeholder="Enter student class roll"
        />

        {/* Father's Name */}
        <AppInput
          name="fatherName"
          label="Father's Name"
          placeholder="Enter father's name"
        />

        {/* Father's Phone Number */}
        <AppInput
          name="fatherPhone"
          label="Father's Phone Number"
          placeholder="Enter father's phone number"
        />

        {/* Mother's Name */}
        <AppInput
          name="motherName"
          label="Mother's Name"
          placeholder="Enter mother's name"
        />
        {/* Mother's Phone Number */}
        <AppInput
          name="motherPhone"
          label="Mother's Phone Number"
          placeholder="Enter mother's phone number"
        />
        {/* Address */}
        <AppInput name="address" label="Address" placeholder="Enter Address" />

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
      </AppForm>
    </div>
  );
};

export default RegisterStudent;
