import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { useDependentDropdown } from "../../hooks/useDependentDropdown";

// For selecting students in a table, we can do a basic approach
function BulkRegistration() {
  const {
    year,
    setYear,
    version,
    setVersion,
    classLevel,
    setClassLevel,
    shift,
    setShift,
    section,
    setSection,
    group,
    setGroup,
    yearOptions,
    versionOptions,
    classOptions,
    shiftOptions,
    sectionOptions,
    groupOptions,
  } = useDependentDropdown();

  const [selectedExamId, setSelectedExamId] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  // 1. Fetch exams matching the chosen (year, version, class, shift, section, group)
  useEffect(() => {
    async function fetchExams() {
      if (!year || !version || !classLevel || !shift || !section) return;
      const query = `year=${year}&version=${version}&class=${classLevel}&shift=${shift}&section=${section}&group=${group}`;
      const res = await axiosInstance.get(`/exams?${query}`);
      setExams(res.data.data || []);
    }
    fetchExams();
  }, [year, version, classLevel, shift, section, group]);

  // 2. Fetch students with matching (year, version, class, shift, section, group)
  async function fetchStudents() {
    if (!year || !version || !classLevel || !shift || !section) return;
    const query = `year=${year}&version=${version}&class=${classLevel}&shift=${shift}&section=${section}&group=${group}`;
    const res = await axiosInstance.get(`/students?${query}`);
    setStudents(res.data.data || []);
  }

  // Bulk register mutation
  const { mutate: bulkRegister } = useMutation({
    mutationFn: async (payload: { examId: string; studentIds: string[] }) => {
      const res = await axiosInstance.post("/exam-registrations/bulk-register", payload);
      return res.data;
    },
    onSuccess: () => {
      alert("Students registered successfully!");
      setSelectedStudents([]);
    },
    onError: (err: any) => {
      console.error(err);
      alert("Error registering students");
    },
  });

  function handleRegister() {
    if (!selectedExamId) {
      alert("Please select an exam");
      return;
    }
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }
    bulkRegister({ examId: selectedExamId, studentIds: selectedStudents });
  }

  function handleStudentSelection(studentId: string) {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Bulk Register Students (Admin)</h2>

      {/* Dependent dropdowns for year/version/class/shift/section/group */}
      <label>Year</label>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">Select Year</option>
        {yearOptions.map((yr) => (
          <option key={yr} value={yr}>
            {yr}
          </option>
        ))}
      </select>

      <label>Version</label>
      <select value={version} onChange={(e) => setVersion(e.target.value)}>
        <option value="">Select Version</option>
        {versionOptions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <label>Class</label>
      <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}>
        <option value="">Select Class</option>
        {classOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label>Shift</label>
      <select value={shift} onChange={(e) => setShift(e.target.value)}>
        <option value="">Select Shift</option>
        {shiftOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <label>Section</label>
      <select value={section} onChange={(e) => setSection(e.target.value)}>
        <option value="">Select Section</option>
        {sectionOptions.map((sec) => (
          <option key={sec} value={sec}>
            {sec}
          </option>
        ))}
      </select>

      <label>Group</label>
      <select value={group} onChange={(e) => setGroup(e.target.value)}>
        {groupOptions.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>

      <button onClick={fetchStudents}>Load Students</button>

      <div style={{ marginTop: "1rem" }}>
        <label>Select Exam:</label>
        <select value={selectedExamId} onChange={(e) => setSelectedExamId(e.target.value)}>
          <option value="">Choose an exam</option>
          {exams.map((exam: any) => (
            <option key={exam._id} value={exam._id}>
              {exam.name} - {exam.year}/{exam.class}/{exam.shift}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h4>Students List</h4>
        <ul>
          {students.map((stu) => (
            <li key={stu._id}>
              <input
                type="checkbox"
                checked={selectedStudents.includes(stu._id)}
                onChange={() => handleStudentSelection(stu._id)}
              />{" "}
              {stu.name} ({stu.rollNumber})
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleRegister}>Register Selected Students</button>
    </div>
  );
}

export default BulkRegistration;
