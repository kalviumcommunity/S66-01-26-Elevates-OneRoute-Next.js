import { sendError, sendSuccess } from '@/lib/responseHandler';
import { taskSchema, TaskInput } from '@/lib/schemas/taskSchema';
import { ZodError } from 'zod';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = taskSchema.parse(body);

    const task = {
      id: crypto.randomUUID(),
      ...validatedData,
    };

    return sendSuccess(task, 'Task created successfully', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        'Validation Error',
        'VALIDATION_ERROR',
        400,
        error.issues.map((e) => ({ field: e.path[0], message: e.message }))
      );
    }
    return sendError('Task creation failed', 'INTERNAL_ERROR', 500, error);
  }
}
