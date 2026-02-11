import { sendError, sendSuccess } from '@/lib/responseHandler';
import { userSchema, UserInput } from '@/lib/schemas/userSchema';
import { ZodError } from 'zod';

type User = UserInput & {
  id: number;
};

const USERS: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 28 },
  { id: 4, name: 'Diana', email: 'diana@example.com', age: 22 },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const start = (page - 1) * limit;
    const data = USERS.slice(start, start + limit);

    return sendSuccess(
      {
        page,
        limit,
        total: USERS.length,
        data,
      },
      'Users fetched successfully'
    );
  } catch (error) {
    return sendError('Failed to fetch users', 'INTERNAL_ERROR', 500, error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = userSchema.parse(body);

    const newUser: User = {
      id: Date.now(),
      ...validatedData,
    };

    return sendSuccess(newUser, 'User created successfully', 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        'Validation Error',
        'VALIDATION_ERROR',
        400,
        error.issues.map((e) => ({ field: e.path[0], message: e.message }))
      );
    }
    return sendError('Failed to create user', 'INTERNAL_ERROR', 500, error);
  }
}
