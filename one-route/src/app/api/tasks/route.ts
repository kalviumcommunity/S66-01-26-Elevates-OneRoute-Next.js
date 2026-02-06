import { sendError, sendSuccess } from '@/lib/responseHandler';

type TaskPayload = {
  title: string;
  status?: 'pending' | 'in-progress' | 'done';
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<TaskPayload>;

    if (!body?.title) {
      return sendError('Missing required field: title', 'VALIDATION_ERROR', 400);
    }

    const task = {
      id: crypto.randomUUID(),
      title: body.title,
      status: body.status ?? 'pending',
    };

    return sendSuccess(task, 'Task created successfully', 201);
  } catch (error) {
    return sendError('Task creation failed', 'INTERNAL_ERROR', 500, error);
  }
}
