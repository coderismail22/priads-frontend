import { Button } from "@/components/ui/button";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const MarkTable = ({
  students,
  marksData,
  onMarkChange,
  onSubmit,
}: any) => (
  <table className="w-full mt-6 border border-gray-300">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2 border text-center">Student Name</th>
        <th className="p-2 border text-center">MCQ</th>
        <th className="p-2 border text-center">CQ</th>
        <th className="p-2 border text-center">Practical</th>
        <th className="p-2 border text-center">Plain</th>
        <th className="p-2 border text-center">Submit</th>
      </tr>
    </thead>
    <tbody>
      {/* TODO: Add type here */}
      {students.map((student: any) => {
        const stu = student.studentId;
        const marks = marksData[stu._id] || {};

        return (
          <tr key={stu._id}>
            <td className="p-2 border text-center">{stu.name}</td>
            <td className="p-2 border text-center">
              <input
                value={marks.mcqMark || 0}
                onChange={(e) =>
                  onMarkChange(stu._id, "mcqMark", Number(e.target.value))
                }
              />
            </td>
            <td className="p-2 border text-center">
              <input
                value={marks.cqMark || 0}
                onChange={(e) =>
                  onMarkChange(stu._id, "cqMark", Number(e.target.value))
                }
              />
            </td>
            <td className="p-2 border text-center">
              <input
                value={marks.practicalMark || 0}
                onChange={(e) =>
                  onMarkChange(stu._id, "practicalMark", Number(e.target.value))
                }
              />
            </td>
            <td className="p-2 border text-center">
              <input
                value={marks.plainMark || 0}
                onChange={(e) =>
                  onMarkChange(stu._id, "plainMark", Number(e.target.value))
                }
              />
            </td>
            <td className="p-1">
              <Button
                className="bg-blue-500 hover:bg-blue-400 text-white rounded"
                onClick={() => onSubmit(stu._id)}
              >
                Submit
              </Button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
