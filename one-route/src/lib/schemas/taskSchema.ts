import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").min(3, "Title must be at least 3 characters long"),
  status: z.enum(["pending", "in-progress", "done"]).optional().default("pending"),
});

export type TaskInput = z.infer<typeof taskSchema>;
