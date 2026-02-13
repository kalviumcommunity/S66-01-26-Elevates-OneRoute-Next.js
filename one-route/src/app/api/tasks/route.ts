import { sendSuccess } from '@/lib/responseHandler';
import { taskSchema } from '@/lib/schemas/taskSchema';
import { handleError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = taskSchema.parse(body);

    const task = {
      id: crypto.randomUUID(),
      ...validatedData,
    };

    logger.info('Task created', { taskId: task.id, title: task.title });

    return sendSuccess(task, 'Task created successfully', 201);
  } catch (error) {
    return handleError(error, 'POST /api/tasks');
  }
}
