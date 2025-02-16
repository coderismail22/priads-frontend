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
import AppYearPicker from "@/components/CustomForm/AppYearPicker";
import AppDatePicker from "@/components/CustomForm/AppDatePicker";

// ✅ Fetch student by ID
const fetchStudentById = async (studentId: string) => {
  const response = await axiosInstance.get(`/students/${studentId}`);
  return response.data;
};

// ✅ Update student function
const updateStudent = async (
  studentId: string,
  data: {
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
  }
) => {
  const response = await axiosInstance.patch(
    `/users/update-student/${studentId}`,
    data
  );
  return response.data;
};

const EditStudent = () => {
  const [profileImg, setProfileImg] = useState<string>("");
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Fetch student details
  const {
    data: student,
    isLoading: isLoadingStudent,
    error: studentError,
  } = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => fetchStudentById(studentId!),
    enabled: !!studentId,
  });

  // ✅ Mutation for updating student
  const mutation = useMutation({
    mutationFn: (data: {
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
    }) => updateStudent(studentId!, data),
    onSuccess: () => {
      Swal.fire("Success!", "Student updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      navigate("/dashboard/admin/student-management/student-info-page");
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      console.log(err);
      handleAxiosError(err, "Failed to update student");
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
  }) => {
    const finalData = {
      ...data,
      profileImg: profileImg || student?.data?.profileImg,
    };
    mutation.mutate(finalData);
  };

  if (isLoadingStudent) return <Loader />;
  if (studentError)
    return <p className="text-red-500 text-center">Something went wrong...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Edit Student
      </h1>
      {student && (
        <AppForm
          onSubmit={onSubmit}
          defaultValues={{
            name: student?.data?.name,
            dob: student?.data?.dob,
            birthRegId: student?.data?.birthRegId,
            bloodGroup: student?.data?.bloodGroup,
            gender: student?.data?.gender,
            phone: student?.data?.phone,
            email: student?.data?.email,
            address: student?.data?.address,
            class: student?.data?.class,
            section: student?.data?.section,
            group: student?.data?.group,
            year: student?.data?.year,
            version: student?.data?.version,
            shift: student?.data?.shift,
            roll: student?.data?.roll,
            fatherName: student?.data?.fatherName,
            fatherPhone: student?.data?.fatherPhone,
            motherName: student?.data?.motherName,
            motherPhone: student?.data?.motherPhone,
          }}
          buttonText="Update Student"
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
          <AppInput
            name="phone"
            label="Phone"
            placeholder="Enter phone number"
          />

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
          <AppInput
            name="address"
            label="Address"
            placeholder="Enter Address"
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
        </AppForm>
      )}
    </div>
  );
};

export default EditStudent;
