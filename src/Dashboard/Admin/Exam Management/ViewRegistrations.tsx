import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { AxiosError } from "axios";
import "../../../../styles/swal.css";
import { Button } from "@/components/ui/button";

const ViewRegistrations = () => {
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

  const [examRegistrations, setExamRegistrations] = useState([]);

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

  // Fetch examRegistrations and show students when an exam is selected
  // const { data: examRegistrations } = useQuery({
  //   queryKey: ["exam-reg"],
  //   queryFn: async () => {
  //     const response = await axiosInstance.get(
  //       `/exam-registrations?examId=${selectedExamId}`
  //     );
  //     console.log("got the registrations", response.data.data);
  //     return response.data.data;
  //   },
  //   enabled: !!selectedExamId,
  // });

  // Fetch examRegistrations and show students when an exam is selected
  const handleLoadRegistrations = async (selectedExamId: string) => {
    try {
      const response = await axiosInstance.get(
        `/exam-registrations/exam-specific-registrations/${selectedExamId}`
      );
      console.log("Registrations:", response.data.data); // Check `data.data`

      setExamRegistrations(response.data.data);
    } catch (error) {
      handleAxiosError(error, "Failed to fetch registrations");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="underline underline-offset-8 text-2xl font-bold mb-6 text-center text-blue-500">
        View Registered Students
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
        {
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
        }

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

      <div className="flex items-center justify-center">
        <Button
          className="bg-gradient-to-tr from-[#6a82fb] to-[#fc5c7d]  hover:from-[#fc5c7d] hover:to-[#6a82fb]"
          disabled={!selectedShift}
          onClick={() => handleLoadRegistrations(selectedExamId)}
        >
          Load Registrations
        </Button>
      </div>

      {/* Table for displaying registered students */}
      {examRegistrations && (
        <div className="mt-10 overflow-x-auto">
          <h1 className="text-center my-5 font-semibold underline underline-offset-4">
            Registered Student List
          </h1>
          <table className="w-full border border-gray-300 overflow-scroll">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-[15px] p-2 border text-center">Roll</th>
                <th className="p-2 border text-center">Name</th>
                <th className="w-[15px] p-2 border text-center">Class</th>
                <th className="w-[15px] p-2 border text-center">Version</th>
                <th className="w-[15px] p-2 border text-center">Shift</th>
                <th className="w-[15px] p-2 border text-center">Section</th>
                <th className="w-[15px] p-2 border text-center">Group</th>
              </tr>
            </thead>
            <tbody>
              {examRegistrations.map((examRegistration, index) => {
                return (
                  <tr key={index}>
                    <td className="p-2 border text-center">
                      {examRegistration?.studentId?.roll}
                    </td>
                    <td className="p-2 border text-center">
                      {examRegistration?.studentId?.name}
                    </td>
                    <td className="p-2 border text-center">
                      {examRegistration?.studentId?.class}
                    </td>
                    <td className="p-2 border text-center">
                      {examRegistration?.studentId?.version}
                    </td>
                    <td className="p-2 border text-center">
                      {examRegistration?.studentId?.shift}
                    </td>
                    <td className="p-2 border text-center">
                      {examRegistration?.studentId?.section}
                    </td>
                    <td className="p-2 border text-center">
                      {examRegistration?.studentId?.group || "NA"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewRegistrations;
