import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { handleAxiosError } from "@/utils/handleAxiosError";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Delete a teacher by ID
const deleteStudent = async (studentId: string) => {
  await axiosInstance.delete(`/users/delete-student/${studentId}`);
};

const StudentInfo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [years, setYears] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [shifts] = useState<string[]>(["Morning", "Day", "Evening"]);
  // TODO: Add type here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  useEffect(() => {
    axiosInstance
      .get("/students/years")
      .then((response) => {
        if (response.data?.data) {
          setYears(response.data.data);
        }
      })
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
      setGroups([]); // ✅ Reset groups if class is below 9
      setSelectedGroup("");
    }
  };

  const handleShiftChange = (shift: string) => {
    setSelectedShift(shift);
  };

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const resetSelections = (keepVersion = false, keepClass = false) => {
    if (!keepVersion) setSelectedVersion("");
    if (!keepClass) setSelectedClass("");
    setSelectedShift("");
    setSelectedSection("");
    setSelectedGroup("");
    setStudents([]);
  };

  const handleLoadStudents = async () => {
    if (
      !selectedYear ||
      !selectedVersion ||
      !selectedClass ||
      !selectedShift ||
      !selectedSection ||
      (parseInt(selectedClass) >= 9 && !selectedGroup)
    ) {
      alert("Please select all required fields before loading students.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.get("/students/filter", {
        params: {
          year: selectedYear,
          version: selectedVersion,
          class: selectedClass,
          shift: selectedShift,
          section: selectedSection,
          group: selectedGroup || undefined,
        },
      });

      setStudents(response.data.data || []);
      // TODO: Add a type here
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleAxiosError(error, "Could not fetch student data.");
    } finally {
      setLoading(false);
    }
  };

  // Take to full student page
  const handleFullStudentInfo = (studentId: string) => {
    navigate(
      `/dashboard/admin/student-management/full-student-info/${studentId}`
    );
  };

  // Take to edit student page
  const handleEdit = (studentId: string) => {
    navigate(`/dashboard/admin/student-management/edit-student/${studentId}`);
  };

  // Delete student mutation
  const mutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      Swal.fire("Deleted!", "Student deleted successfully!", "success");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      handleAxiosError(error, "Failed to delete student.");
    },
  });

  // Handle student deletion
  const handleDelete = (studentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete student!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(studentId);
      }
    });
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 underline underline-offset-8">
        Student Information
      </h1>
      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Group Selection */}
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
      </div>

      {/* Load Students Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleLoadStudents}
          disabled={loading}
          className="font- bg-gradient-to-tr from-[#6a82fb] to-[#fc5c7d]  hover:from-[#fc5c7d] hover:to-[#6a82fb]"
        >
          {loading ? "Loading..." : "Load Students"}
        </Button>
      </div>

      {/* Display Students */}
      {students && (
        <div className="mt-10">
          <h2 className="text-center underline underline-offset-4 text-lg font-semibold text-gray-700">
            Student List
          </h2>
          {students.length === 0 ? (
            <p className="text-gray-500 mt-2 text-center">No students found.</p>
          ) : (
            <table className="w-full mt-4 border border-gray-300 text-left rounded-md">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-3 border">Student ID</th>
                  <th className="p-3 border">Roll</th>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Class</th>
                  <th className="p-3 border">Shift</th>
                  <th className="p-3 border">Section</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.studentId}
                    className="border hover:bg-gray-50"
                  >
                    <td className="p-3 border">{student.studentId}</td>
                    <td className="p-3 border">{student.roll || "NA"}</td>
                    <td className="p-3 border">{student.name}</td>
                    <td className="p-3 border">{student.class}</td>
                    <td className="p-3 border">{student.shift}</td>
                    <td className="p-3 border">{student.section}</td>
                    <td>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-5 w-5">
                            <BiDotsVertical className="h-10 w-10" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleFullStudentInfo(student._id)}
                          >
                            <IoIosInformationCircleOutline className="text-green-700" />
                            <p className="text-[12px]">Full Info</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(student._id)}
                          >
                            <FaRegEdit className="text-green-700" />
                            <p className="text-[12px]">Edit</p>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(student._id)}
                          >
                            <FaTrash className="text-red-500" />
                            <p className="text-[12px]">Delete</p>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentInfo;
