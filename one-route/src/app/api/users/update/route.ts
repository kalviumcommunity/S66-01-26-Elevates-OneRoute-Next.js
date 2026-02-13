import { sendSuccess } from '@/lib/responseHandler';
import { handleError, AppError } from '@/lib/errorHandler';
import { logger } from '@/lib/logger';
import { verifyToken } from '@/lib/auth';
import redis from '@/lib/redis';
import { z } from 'zod';
import { sanitizePayload } from '@/lib/security/sanitizer';

const updateUserSchema = z.object({
  id: z.number(),
  name: z.string().min(2),
  age: z.number().optional(),
});

type UpdateUserInput = z.infer<typeof updateUserSchema>;

const USERS: any[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 28 },
  { id: 4, name: 'Diana', email: 'diana@example.com', age: 22 },
];

export async function PUT(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const decoded = verifyToken(authHeader);

    if (!decoded) {
      throw new AppError('Missing or invalid token', 'UNAUTHORIZED', 401);
    }

    const body = await req.json();
    const sanitizedBody = sanitizePayload(body);
    const validatedData = updateUserSchema.parse(sanitizedBody);

    const userIndex = USERS.findIndex(u => u.id === validatedData.id);
    if (userIndex === -1) {
      throw new AppError('User not found', 'USER_NOT_FOUND', 404);
    }

    USERS[userIndex] = {
      ...USERS[userIndex],
      name: validatedData.name,
      ...(validatedData.age && { age: validatedData.age }),
    };

    await redis.del('users:list:*');

    logger.info('User updated and cache invalidated', {
      userId: validatedData.id,
      updatedBy: decoded.email,
      name: validatedData.name,
    });

    return sendSuccess(USERS[userIndex], 'User updated successfully');
  } catch (error) {
    return handleError(error, 'PUT /api/users/update');
  }
}
