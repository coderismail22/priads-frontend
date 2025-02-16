import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { BackendErrorResponse } from "@/types/backendErrorResponse.type";
import { handleAxiosError } from "@/utils/handleAxiosError";
import AppForm from "@/components/CustomForm/AppForm";
import AppInput from "@/components/CustomForm/AppInput";
import AppSelect from "@/components/CustomForm/AppSelect";
import AppCheckbox from "@/components/CustomForm/AppCheckbox";
import AppYearPicker from "@/components/CustomForm/AppYearPicker";
import Loader from "@/components/Loader/Loader";
interface ISubject {
  name: string;
  code: string;
  year: string;
  version: string;
  class: string;
  shift: string;
  section: string;
  group: string;
  hasPlainMark: boolean;
  hasMCQ: boolean;
  hasCQ: boolean;
  hasPractical: boolean;
  mcqMark: number;
  cqMark: number;
  practicalMark: number;
  plainMark: number;
  totalMark: number;
  subjectTeacher: string;
}
const fetchTeachers = async () => {
  const response = await axiosInstance.get("/teachers/");
  return response?.data?.data;
};
const createSubject = async (subjectData: ISubject) => {
  const response = await axiosInstance.post(
    "/subjects/create-subject",
    subjectData
  );
  return response.data;
};

const AddSubject = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for creating a subject
  const mutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      Swal.fire("Success!", "Subject added successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      navigate("/dashboard/admin/exam-management/add-subject");
    },
    onError: (err: AxiosError<BackendErrorResponse>) => {
      console.log(err);
      handleAxiosError(err, "Failed to add subject");
    },
  });

  // Fetch Teachers
  const {
    data: teachers,
    isLoading: isLoadingTeachers,
    error: teachersError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
  });

  const onSubmit = (data: ISubject) => {
    const mcqMark = Number(data.mcqMark);
    const cqMark = Number(data.cqMark);
    const practicalMark = Number(data.practicalMark);
    const totalMark = mcqMark + cqMark + practicalMark;
    const finalData = {
      ...data,
      mcqMark,
      cqMark,
      practicalMark,
      totalMark,
    };
    mutation.mutate(finalData);
    console.log(finalData);
  };

  if (isLoadingTeachers) {
    return <Loader />;
  }
  if (teachersError) {
    return <p>Error loading data. Please try again.</p>;
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Add Subject
      </h1>
      <AppForm
        onSubmit={onSubmit}
        // TODO: Add form schema
        // schema={}
        defaultValues={{
          name: "",
          code: "",
          year: "",
          version: "Bangla",
          class: "",
          shift: "Morning",
          section: "",
          group: "",
          hasMCQ: false,
          hasCQ: false,
          hasPractical: false,
          mcqMark: 0,
          cqMark: 0,
          practicalMark: 0,
          totalMark: 0,
          subjectTeacher: "",
        }}
        buttonText="Create Subject"
      >
        <AppInput
          name="name"
          label="Subject Name"
          placeholder="Enter subject name"
        />
        <AppInput
          name="code"
          label="Subject Code"
          placeholder="Enter subject code"
        />
        {/* Year Picker */}
        <AppYearPicker name="year" label="Year" />
        <AppSelect
          name="version"
          label="Version"
          placeholder="Select a version"
          options={[
            { value: "Bangla", label: "Bangla" },
            { value: "English", label: "English" },
          ]}
        />
        <AppSelect
          name="class"
          label="Class"
          placeholder="Select a class"
          options={[
            { value: "1", label: "One" },
            { value: "2", label: "Two" },
            { value: "3", label: "Three" },
            { value: "4", label: "Four" },
            { value: "5", label: "Five" },
            { value: "6", label: "Six" },
            { value: "7", label: "Seven" },
            { value: "8", label: "Eight" },
            { value: "9", label: "Nine" },
            { value: "10", label: "Ten" },
            { value: "11", label: "Eleven" },
            { value: "12", label: "Twelve" },
          ]}
        />
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
        <AppSelect
          name="section"
          label="Section"
          placeholder="Select a section"
          options={[
            { value: "A", label: "A" },
            { value: "B", label: "B" },
            { value: "C", label: "C" },
            { value: "D", label: "D" },
            { value: "E", label: "E" },
            { value: "F", label: "F" },
          ]}
        />
        <AppSelect
          name="group"
          label="Group"
          placeholder="Select a group"
          options={[
            { value: "Science", label: "Science" },
            { value: "Arts", label: "Arts" },
            { value: "Commerce", label: "Commerce" },
            { value: "NA", label: "NA" },
          ]}
        />
        <div className="my-5 grid grid-cols-3  gap-5 items-center justify-center">
          <AppCheckbox name="hasMCQ" label="Has MCQ?" />
          <AppCheckbox name="hasCQ" label="Has CQ?" />
          <AppCheckbox name="hasPractical" label="Has Practical?" />
        </div>
        <AppInput
          name="mcqMark"
          label="MCQ Mark"
          placeholder="Enter MCQ mark"
        />
        <AppInput name="cqMark" label="CQ Mark" placeholder="Enter CQ mark" />
        <AppInput
          name="practicalMark"
          label="Practical Mark"
          placeholder="Enter practical mark"
        />

        {/* Teacher */}
        <AppSelect
          name="subjectTeacher"
          label="Subject Teacher"
          placeholder="Select a teacher"
          options={teachers.map((teacher: { _id: string; name: string }) => ({
            value: teacher._id,
            label: teacher.name,
          }))}
        />
      </AppForm>
    </div>
  );
};

export default AddSubject;
