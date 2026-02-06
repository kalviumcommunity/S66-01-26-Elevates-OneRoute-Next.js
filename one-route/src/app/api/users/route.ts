import { sendError, sendSuccess } from '@/lib/responseHandler';

type User = {
  id: number;
  name: string;
};

const USERS: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'Diana' },
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

    if (!body?.name) {
      return sendError('Missing required field: name', 'VALIDATION_ERROR', 400);
    }

    const newUser: User = {
      id: Date.now(),
      name: body.name,
    };

    return sendSuccess(newUser, 'User created successfully', 201);
  } catch (error) {
    return sendError('Failed to create user', 'INTERNAL_ERROR', 500, error);
  }
}
