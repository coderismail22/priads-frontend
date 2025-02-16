// TODO: Add multiple types
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authKey } from "@/api/authKey";
import axiosInstance from "@/api/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface IStudent {
  year: string;
  version: string;
  class: string;
  shift: string;
  section: string;
  group: string;
}

function StudentViewResults() {
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData<{ studentId: string }>(authKey);
  const studentId = authData?.studentId || ""; // from context or local storage

  const [exams, setExams] = useState<any[]>([]); //when student comes to this page auto load the exam matching exam list
  const [selectedExamId, setSelectedExamId] = useState(""); // when student picks an exam
  const [results, setResults] = useState<any[]>([]); // fetches and sets the result for the selected exam
  const [examInfo, setExamInfo] = useState<any>(null); // fetches and sets the subject details for the selected exam

  useEffect(() => {
    if (!studentId) return;

    // Fetch student details
    axiosInstance
      .get(`/students/${studentId}`)
      .then((res) => {
        const studentData: IStudent = res.data.data;
        const {
          year,
          version,
          class: studentClass,
          shift,
          section,
          group,
        } = studentData;

        // Construct exams API URL dynamically
        const examsUrl = `/exams?year=${year}&version=${version}&class=${studentClass}&shift=${shift}&section=${section}&group=${group}`;

        return axiosInstance.get(examsUrl);
      })
      .then((res) => {
        setExams(res?.data?.data || []);
      })
      .catch((err) => console.error(err));
  }, [studentId]);

  // When the student picks an exam
  async function handleSelectExam(examId: string) {
    setSelectedExamId(examId);

    // 2) Optionally fetch the exam doc for subject details
    const examRes = await axiosInstance.get(`/exams/${examId}`);
    setExamInfo(examRes.data.data);

    // 3) Then fetch the results for that exam + this student
    const resultRes = await axiosInstance.get(
      `/exam-results?examId=${examId}&studentId=${studentId}`
    );
    setResults(resultRes.data.data);
  }

  const mergedSubjects =
    examInfo?.subjects?.map((sub: any) => {
      const found = results.find((r: any) => r.examSubjectId._id === sub._id);

      return {
        ...sub,
        marks: found?.marks || null,
      };
    }) || [];

  return (
    <div>
      <p className="text-center text-2xl mb-5 text-blue-500 underline underline-offset-8">
        See Your Results
      </p>

      {/* Dropdown of student's available exams */}
      <div className="max-w-md">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Select Exam:{" "}
        </label>
        <select
          value={selectedExamId}
          onChange={(e) => handleSelectExam(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white hover:shadow-md"
        >
          <option value="">Choose an exam</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.name} ({exam.year}, {exam.class}, {exam.shift})
            </option>
          ))}
        </select>
      </div>

      {/* If user selected an exam, display the subjects + marks */}
      {selectedExamId && examInfo && (
        <>
          {/* <h3>{examInfo.name}</h3> */}
          {/* <h3>{examInfo._id}</h3> */}
          <table className="w-full mt-6 border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-center">Subject</th>
                <th className="p-2 border text-center">MCQ</th>
                <th className="p-2 border text-center">CQ</th>
                <th className="p-2 border text-center">Practical</th>
                <th className="p-2 border text-center">Total</th>
                {/* <th className="p-2 border">Grade (Optional)</th> */}
              </tr>
            </thead>
            <tbody>
              {mergedSubjects.map((s: any) => (
                <tr key={s._id} className="text-center">
                  <td className="p-2 border text-center">{s.name}</td>
                  <td className="p-2 border text-center">
                    {s.marks?.mcqMark ?? 0}
                  </td>
                  <td className="p-2 border text-center">
                    {s.marks?.cqMark ?? 0}
                  </td>
                  <td className="p-2 border text-center">
                    {s.marks?.practicalMark ?? 0}
                  </td>
                  <td className="p-2 border text-center">
                    {s.marks?.totalMark ?? 0}
                  </td>
                  {/* <td className="p-2 border">Grade</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default StudentViewResults;
