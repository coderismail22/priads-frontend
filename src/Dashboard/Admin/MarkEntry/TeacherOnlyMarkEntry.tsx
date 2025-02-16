import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";
import Swal from "sweetalert2";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { AxiosError } from "axios";
import "../../../../styles/swal.css";
import { Button } from "@/components/ui/button";
import { authKey } from "@/api/authKey";

// Save student mark
// TODO: Add a type here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveStudentMarks = async (payload: any) => {
  const response = await axiosInstance.post(
    "/exam-results/create-or-update",
    payload
  );
  return response?.data;
};

// Fetch exams dynamically based on filters
const fetchExams = async (queryParams: string) => {
  const response = await axiosInstance.get(
    `/exams/teacher-only-exams?${queryParams}`
  );
  return response?.data?.data;
};

// Fetch students and results
const fetchStudents = async ({ queryKey }) => {
  const [, examId] = queryKey;
  const response = await axiosInstance.get(
    `/exam-registrations?examId=${examId}`
  );
  return response?.data?.data;
};

const fetchResults = async ({ queryKey }) => {
  const [, examId, examSubjectId] = queryKey;
  const response = await axiosInstance.get(
    `/exam-results?examId=${examId}&examSubjectId=${examSubjectId}`
  );
  return response.data.data;
};

const TeacherOnlyMarkEntry = () => {
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData<{ teacherId: string }>(authKey);
  const teacherId = authData?.teacherId || ""; // from context or local storage

  // States for dropdowns
  const [years, setYears] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [shifts] = useState<string[]>(["Morning", "Day", "Evening"]);
  const [sections, setSections] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);

  // Selection states
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  // Existing states
  const [selectedExamId, setSelectedExamId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [students, setStudents] = useState([]);

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
    setStudents([]);
  };

  // Fetch exams based on filters
  const filterParams = new URLSearchParams({
    year: selectedYear,
    version: selectedVersion,
    className: selectedClass,
    shift: selectedShift,
    section: selectedSection,
    group: selectedGroup,
    teacherId,
  }).toString();

  const { data: exams } = useQuery({
    queryKey: ["teacherExams", filterParams],
    queryFn: () => fetchExams(filterParams),
    enabled: !!(
      selectedYear &&
      selectedVersion &&
      selectedClass &&
      selectedShift &&
      selectedSection
    ),
  });

  // Fetch students and results
  const { data: registeredStudents } = useQuery({
    queryKey: ["students", selectedExamId],
    queryFn: fetchStudents,
    enabled: !!selectedExamId,
  });

  const { data: results } = useQuery({
    queryKey: ["results", selectedExamId, selectedSubjectId],
    queryFn: fetchResults,
    enabled: !!selectedExamId && !!selectedSubjectId,
  });

  // Combine students and results data
  useEffect(() => {
    if (registeredStudents && results) {
      const studentMarksMap = results.reduce((acc, result) => {
        acc[result.studentId._id] = result.marks;
        return acc;
      }, {});

      const combinedStudents = registeredStudents?.map((registration) => ({
        ...registration,
        marks: studentMarksMap[registration.studentId._id] || {},
      }));

      setStudents(combinedStudents);
      setMarksData(
        combinedStudents.reduce(
          (acc, student) => ({
            ...acc,
            [student.studentId._id]: student.marks,
          }),
          {}
        )
      );
    }
  }, [registeredStudents, results]);

  // Mutation to save marks
  const mutation = useMutation({
    mutationFn: saveStudentMarks,
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Student marks saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["saveMark"] });
    },
    onError: (err: AxiosError) =>
      handleAxiosError(err, "Failed to save student marks"),
  });

  const handleExamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const examId = event.target.value;

    // Set selected exam ID
    setSelectedExamId(examId);

    // Find the selected exam from the exams array
    const selectedExam = exams?.find((exam) => exam._id === examId);

    if (selectedExam) {
      // Filter subjects where the subjectTeacher's _id matches the tid
      const filteredSubjects = selectedExam.subjects.filter(
        (subject) => subject?.subjectTeacher?._id === teacherId
      );

      // Set filtered subjects to the state
      setSubjects(filteredSubjects);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(e.target.value);
  };

  const handleMarkChange = (
    studentId: string,
    field: string,
    value: number
  ) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSubmitStudentMarks = (studentId: string) => {
    if (!selectedSubjectId) {
      Swal.fire("Error", "Please select a subject", "error");
      return;
    }

    const studentMarks = marksData[studentId] || {};
    mutation.mutate({
      examId: selectedExamId,
      examSubjectId: selectedSubjectId,
      studentId,
      teacherId,
      marks: {
        mcqMark: studentMarks.mcqMark || 0,
        cqMark: studentMarks.cqMark || 0,
        practicalMark: studentMarks.practicalMark || 0,
        plainMark: studentMarks.plainMark || 0,
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-center underline underline-offset-8 text-blue-500">
        Mark Entry (Assigned Teacher Only)
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
            {years?.map((year) => (
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
            {versions?.map((version) => (
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
            {classes?.map((className) => (
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
            {shifts?.map((shift) => (
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
            {sections?.map((section) => (
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
              {groups?.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Exam Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Select Exam:
          </label>
          <select
            value={selectedExamId}
            onChange={handleExamChange}
            // disabled={!selectedGroup}
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

        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Select Subject:
          </label>
          <select
            value={selectedSubjectId}
            onChange={handleSubjectChange}
            disabled={!selectedExamId}
            className={`w-full px-4 py-2 border rounded-md shadow-sm transition-all bg-white ${
              !selectedExamId
                ? "bg-gray-200 cursor-not-allowed"
                : "border-gray-300 hover:shadow-md focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value="">Choose a subject</option>
            {subjects?.map((subject) => (
              <option
                key={subject?._id}
                value={subject?._id}
                data-teacher-id={subject?.subjectTeacher?._id}
              >
                {subject?.name} | {subject?.subjectTeacher?.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mark Table For All Students */}
      {selectedSubjectId && (
        <table className="w-full mt-6 border border-gray-300">
          {/* Header */}
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-center">Student Name</th>
              <th className="p-2 border text-center">MCQ</th>
              <th className="p-2 border text-center">CQ</th>
              <th className="p-2 border text-center">Practical</th>
              <th className="p-2 border text-center">Submit</th>
            </tr>
          </thead>
          {/* Body */}
          <tbody>
            {students?.map((student) => {
              const stu = student?.studentId;
              const marks = marksData[stu._id] || {};

              return (
                <tr key={stu._id}>
                  <td className="p-2 border text-center">{stu.name}</td>
                  <td className="p-2 border text-center">
                    <input
                      value={marks.mcqMark || 0}
                      className="text-center bg-white"
                      onChange={(e) =>
                        handleMarkChange(
                          stu._id,
                          "mcqMark",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      value={marks.cqMark || 0}
                      className="text-center bg-white"
                      onChange={(e) =>
                        handleMarkChange(
                          stu._id,
                          "cqMark",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      value={marks.practicalMark || 0}
                      className="text-center bg-white"
                      onChange={(e) =>
                        handleMarkChange(
                          stu._id,
                          "practicalMark",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>

                  <td className="p-2 text-center">
                    <Button
                      className=" bg-blue-500 hover:bg-blue-400 text-white rounded"
                      onClick={() => handleSubmitStudentMarks(stu._id)}
                    >
                      Submit
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherOnlyMarkEntry;
