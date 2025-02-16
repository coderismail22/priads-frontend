import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useDependentDropdown } from "@/hooks/useDependentDropdown";
import axiosInstance from "@/api/axiosInstance";

// For brevity, not embedding a full subdocument form here
const createExamSchema = z.object({
  name: z.string().nonempty(),
  year: z.string().nonempty(),
  version: z.string().nonempty(),
  class: z.string().nonempty(),
  shift: z.string().nonempty(),
  section: z.string().nonempty(),
  group: z.string().optional(),
});

type CreateExamFormValues = z.infer<typeof createExamSchema>;

function CreateExam() {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateExamFormValues>({
    resolver: zodResolver(createExamSchema),
  });

  const { mutate } = useMutation({
    mutationFn: async (data: CreateExamFormValues) => {
      const res = await axiosInstance.post("/exams/create-exam", data);
      return res.data;
    },
    onSuccess: () => {
      alert("Exam created successfully!");
    },
    onError: (error: any) => {
      console.error(error);
      alert("Error creating exam");
    },
  });

  const onSubmit = (formData: CreateExamFormValues) => {
    mutate({
      ...formData,
      year,
      version,
      class: classLevel,
      shift,
      section,
      group,
    });
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Create Exam (Admin)</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Dependent dropdowns for (year, version, class, shift, section, group) */}
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
          {versionOptions.map((ver) => (
            <option key={ver} value={ver}>
              {ver}
            </option>
          ))}
        </select>

        <label>Class</label>
        <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)}>
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <label>Shift</label>
        <select value={shift} onChange={(e) => setShift(e.target.value)}>
          <option value="">Select Shift</option>
          {shiftOptions.map((sh) => (
            <option key={sh} value={sh}>
              {sh}
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

        <label>Exam Name:</label>
        <input {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}

        <button type="submit">Create Exam</button>
      </form>
    </div>
  );
}

export default CreateExam;
