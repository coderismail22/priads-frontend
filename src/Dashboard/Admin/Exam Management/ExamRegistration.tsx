import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { AxiosError } from "axios";
import "../../../../styles/swal.css";
import AppSelect from "@/components/CustomForm/AppSelect";
import AppForm from "@/components/CustomForm/AppForm";

const ExamRegistration = () => {
  // Dropdown States
  const [years, setYears] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [shifts] = useState<string[]>(["Morning", "Day", "Evening"]);
  const [sections, setSections] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);

  // Selection States
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");

  // Fetch dropdown data dynamically
  useEffect(() => {
    axiosInstance
      .get("/students/years")
      .then((response) => setYears(response.data.data || []))
      .catch((error) => console.error("Failed to fetch years:", error));
  }, []);

  const handleYearChange = async (year: string) => {
    setSelectedYear(year);
    resetSelections();
    const response = await axiosInstance.get(`/students/versions/${year}`);
    setVersions(response.data.data || []);
  };

  const handleVersionChange = async (version: string) => {
    setSelectedVersion(version);
    resetSelections(true);
    const response = await axiosInstance.get(
      `/students/classes/${selectedYear}/${version}`
    );
    setClasses(response.data.data || []);
  };

  const handleClassChange = async (className: string) => {
    setSelectedClass(className);
    resetSelections(true, true);
    const response = await axiosInstance.get(
      `/students/sections/${selectedYear}/${selectedVersion}/${className}`
    );
    setSections(response.data.data || []);

    if (parseInt(className) >= 9) {
      const groupResponse = await axiosInstance.get(
        `/students/groups/${selectedYear}/${selectedVersion}/${className}`
      );
      setGroups(groupResponse.data.data || []);
    } else {
      setGroups([]);
      setSelectedGroup("");
    }
  };

  const handleShiftChange = (shift: string) => setSelectedShift(shift);
  const handleSectionChange = (section: string) => setSelectedSection(section);

  const resetSelections = (keepVersion = false, keepClass = false) => {
    if (!keepVersion) setSelectedVersion("");
    if (!keepClass) setSelectedClass("");
    setSelectedShift("");
    setSelectedSection("");
    setSelectedGroup("");
  };

  // Fetch exams based on filters
  const filterParams = new URLSearchParams({
    year: selectedYear,
    version: selectedVersion,
    className: selectedClass,
    shift: selectedShift,
    section: selectedSection,
    group: selectedGroup,
  }).toString();

  const { data: exams } = useQuery({
    queryKey: ["exams", filterParams],
    queryFn: async () => {
      const response = await axiosInstance.get(`/exams?${filterParams}`);
      return response.data.data;
    },
    enabled: !!(
      selectedYear &&
      selectedVersion &&
      selectedClass &&
      selectedShift &&
      selectedSection
    ),
  });

  // Handle Exam Selection
  const handleExamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExamId(event.target.value);
  };

  // Fetch students when an exam is selected
  const { data: students } = useQuery({
    queryKey: ["students", filterParams],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/students/filter?${filterParams}`
      );
      return response.data.data;
    },
    enabled: !!(
      selectedYear &&
      selectedVersion &&
      selectedClass &&
      selectedShift &&
      selectedSection
    ),
  });

  // Register students API call
  const mutation = useMutation({
    mutationFn: async (data: { examId: string; studentIds: string[] }) => {
      const response = await axiosInstance.post(
        "/exam-registrations/bulk-register",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Registered!",
        text: "Students successfully registered for the exam.",
      });
    },
    onError: (err: AxiosError) =>
      handleAxiosError(err, "Failed to register students"),
  });

  // Exam Registration Form Submit Handler
  // TODO: Add a type here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (!selectedExamId) {
      Swal.fire("Error", "Please select an exam", "error");
      return;
    }
    if (data?.students?.length === 0) {
      Swal.fire("Error", "Please select at least one student", "error");
      return;
    }
    // Create the payload for registration
    const payload = {
      examId: selectedExamId,
      studentIds: data?.students,
    };

    // Call the mutation with the payload
    mutation.mutate(payload);
  };
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-500">
        Exam Registration
      </h1>

      {/* Dropdowns */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Year Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Year:
          </label>
          <select
            onChange={(e) => handleYearChange(e.target.value)}
            value={selectedYear}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white hover:shadow-md"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Version Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Version:
          </label>
          <select
            onChange={(e) => handleVersionChange(e.target.value)}
            value={selectedVersion}
            disabled={!selectedYear}
            className={`w-full px-4 py-2 border rounded-md shadow-sm transition-all bg-white ${
              !selectedYear
                ? "bg-gray-200 cursor-not-allowed"
                : "border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Version</option>
            {versions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>

        {/* Class Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Class:
          </label>
          <select
            onChange={(e) => handleClassChange(e.target.value)}
            value={selectedClass}
            disabled={!selectedVersion}
            className={`w-full px-4 py-2 border rounded-md shadow-sm transition-all bg-white ${
              !selectedVersion
                ? "bg-gray-200 cursor-not-allowed"
                : "border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Class</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Shift:
          </label>
          <select
            onChange={(e) => handleShiftChange(e.target.value)}
            value={selectedShift}
            disabled={!selectedClass}
            className={`w-full px-4 py-2 border rounded-md shadow-sm transition-all bg-white ${
              !selectedClass
                ? "bg-gray-200 cursor-not-allowed"
                : "border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Shift</option>
            {shifts.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </div>

        {/* Section Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Section:
          </label>
          <select
            onChange={(e) => handleSectionChange(e.target.value)}
            value={selectedSection}
            disabled={!selectedShift}
            className={`w-full px-4 py-2 border rounded-md shadow-sm transition-all bg-white ${
              !selectedShift
                ? "bg-gray-200 cursor-not-allowed"
                : "border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        {/* Group Selection (Only for Class 9-12) */}
        {parseInt(selectedClass) >= 9 && (
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Group:
            </label>
            <select
              onChange={(e) => setSelectedGroup(e.target.value)}
              value={selectedGroup}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white hover:shadow-md"
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Exam Selection */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Select Exam:
          </label>
          <select
            value={selectedExamId}
            onChange={handleExamChange}
            disabled={!exams || exams.length === 0}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white hover:shadow-md"
          >
            <option value="">Choose an exam</option>
            {exams?.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.name} ({exam.year})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form */}
      <div>
        <AppForm
          onSubmit={onSubmit}
          buttonText="Register"
          defaultValues={{ students: [] }}
        >
          {/* Student Multi-Select Dropdown */}
          {selectedExamId && (
            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Select Students:
              </label>
              <AppSelect
                name="students"
                label="Students"
                placeholder="Select students"
                isMulti={true}
                options={students?.map(
                  (student: { _id: string; roll: string; name: string }) => ({
                    value: student._id,
                    label: `${student?.roll} | ${student.name}`,
                  })
                )}
              />
            </div>
          )}
        </AppForm>
      </div>
    </div>
  );
};

export default ExamRegistration;
