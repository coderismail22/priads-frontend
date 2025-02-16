import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useDependentDropdown } from "@/hooks/useDependentDropdown";
import axiosInstance from "@/api/axiosInstance";

const createSubjectSchema = z.object({
  name: z.string().nonempty(),
  code: z.string().nonempty(),
  year: z.string().nonempty(),
  version: z.string().nonempty(),
  class: z.string().nonempty(),
  shift: z.string().nonempty(),
  section: z.string().nonempty(),
  group: z.string().optional(),
  hasPlainMarks: z.boolean().optional(),
  hasMCQ: z.boolean().optional(),
  hasCQ: z.boolean().optional(),
  hasPractical: z.boolean().optional(),
  mcqMarks: z.number().optional(),
  cqMarks: z.number().optional(),
  practicalMarks: z.number().optional(),
  plainMarks: z.number().optional(),
  totalMarks: z.number().min(1),
  subjectTeacher: z.string().nonempty(),
});

type CreateSubjectFormValues = z.infer<typeof createSubjectSchema>;

function CreateSubject() {
  // Using local states for the dependent dropdown
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
  } = useForm<CreateSubjectFormValues>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      year: "",
      version: "",
      class: "",
      shift: "",
      section: "",
      group: "NA",
      mcqMarks: 0,
      cqMarks: 0,
      practicalMarks: 0,
      plainMarks: 0,
      totalMarks: 100,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: CreateSubjectFormValues) => {
      const res = await axiosInstance.post("/subjects/create-subject", data);
      return res.data;
    },
    onSuccess: () => {
      alert("Subject created successfully!");
    },
    onError: (error: any) => {
      console.error(error);
      alert("Error creating subject");
    },
  });

  const onSubmit = (formData: CreateSubjectFormValues) => {
    mutate({
      ...formData,
      // Overwrite any relevant fields from our dependent dropdown states:
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
      <h2>Create Subject (Admin)</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "grid", gap: "0.5rem" }}
      >
        {/* Dependent dropdown for year */}
        <label>Year:</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          {yearOptions.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>

        <label>Version:</label>
        <select value={version} onChange={(e) => setVersion(e.target.value)}>
          <option value="">Select Version</option>
          {versionOptions.map((ver) => (
            <option key={ver} value={ver}>
              {ver}
            </option>
          ))}
        </select>

        <label>Class:</label>
        <select
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
        >
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <label>Shift:</label>
        <select value={shift} onChange={(e) => setShift(e.target.value)}>
          <option value="">Select Shift</option>
          {shiftOptions.map((sh) => (
            <option key={sh} value={sh}>
              {sh}
            </option>
          ))}
        </select>

        <label>Section:</label>
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">Select Section</option>
          {sectionOptions.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <label>Group:</label>
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          {groupOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <label>Subject Name:</label>
        <input {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}

        <label>Subject Code:</label>
        <input {...register("code")} />
        {errors.code && <p>{errors.code.message}</p>}

        <label>Subject Teacher (ObjectId):</label>
        <input {...register("subjectTeacher")} />
        {errors.subjectTeacher && <p>{errors.subjectTeacher.message}</p>}

        <label>Total Marks:</label>
        <input
          type="number"
          {...register("totalMarks", { valueAsNumber: true })}
        />
        {errors.totalMarks && <p>{errors.totalMarks.message}</p>}

        <label>Has MCQ:</label>
        <input type="checkbox" {...register("hasMCQ")} />

        <label>MCQ Marks:</label>
        <input
          type="number"
          {...register("mcqMarks", { valueAsNumber: true })}
        />
        {errors.mcqMarks && <p>{errors.mcqMarks.message}</p>}

        {/* Repeat for hasCQ, cqMarks, etc. as needed */}

        <button type="submit" disabled={isLoading}>
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateSubject;
