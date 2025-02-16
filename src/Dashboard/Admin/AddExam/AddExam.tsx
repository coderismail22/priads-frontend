// import { useEffect, useState } from "react";
// import axios from "axios";

// const AddExam = () => {
//   const [form, setForm] = useState({
//     name: "",
//     academicYear: "",
//     term: "",
//     startDate: "",
//     endDate: "",
//     classes: [],
//     subjects: [],
//   });

//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [classes, setClasses] = useState([]);

//   // Fetch data for dropdowns
//   const fetchData = async () => {
//     const teachersRes = await axios.get("/api/teachers");
//     const subjectsRes = await axios.get("/api/subjects");
//     const classesRes = await axios.get("/api/classes");

//     setTeachers(teachersRes.data);
//     setSubjects(subjectsRes.data);
//     setClasses(classesRes.data);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await axios.post("/api/exams", form);
//     if (response.data.success) {
//       alert("Exam created successfully!");
//     } else {
//       alert("Failed to create exam!");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h1>Create Exam</h1>

//       <input
//         type="text"
//         placeholder="Exam Name"
//         value={form.name}
//         onChange={(e) => setForm({ ...form, name: e.target.value })}
//         required
//       />
//       <input
//         type="text"
//         placeholder="Academic Year"
//         value={form.academicYear}
//         onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
//         required
//       />
//       <input
//         type="text"
//         placeholder="Term"
//         value={form.term}
//         onChange={(e) => setForm({ ...form, term: e.target.value })}
//         required
//       />
//       <input
//         type="date"
//         placeholder="Start Date"
//         value={form.startDate}
//         onChange={(e) => setForm({ ...form, startDate: e.target.value })}
//         required
//       />
//       <input
//         type="date"
//         placeholder="End Date"
//         value={form.endDate}
//         onChange={(e) => setForm({ ...form, endDate: e.target.value })}
//         required
//       />

//       {/* Classes */}
//       <select
//         multiple
//         onChange={(e) =>
//           setForm({
//             ...form,
//             classes: Array.from(e.target.selectedOptions).map((o) => o.value),
//           })
//         }
//       >
//         {classes.map((cls) => (
//           <option key={cls._id} value={cls._id}>
//             {cls.name}
//           </option>
//         ))}
//       </select>

//       {/* Subjects */}
//       {subjects.map((subject) => (
//         <div key={subject._id}>
//           <label>{subject.name}</label>
//           <select
//             onChange={(e) =>
//               setForm({
//                 ...form,
//                 subjects: [
//                   ...form.subjects,
//                   {
//                     subjectId: subject._id,
//                     teacherId: e.target.value,
//                     totalMarks: 100,
//                   },
//                 ],
//               })
//             }
//           >
//             <option value="">Select Teacher</option>
//             {teachers.map((teacher) => (
//               <option key={teacher._id} value={teacher._id}>
//                 {teacher.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       ))}

//       <button type="submit">Create Exam</button>
//     </form>
//   );
// };

// export default AddExam;
