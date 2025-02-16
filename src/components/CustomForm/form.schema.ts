import { z } from "zod";

const createSubjectSchema = z.object({
  name: z.string().min(1).max(50),
  code: z.string().min(1).max(20),
});

export const FormSchemas = {
  createSubjectSchema,
};
