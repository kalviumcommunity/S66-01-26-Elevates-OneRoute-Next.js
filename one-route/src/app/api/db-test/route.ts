import { testDatabaseConnection } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const isConnected = await testDatabaseConnection();
    
    if (isConnected) {
      return Response.json({
        status: 'success',
        message: 'Database connection successful',
        timestamp: new Date().toISOString(),
      });
    } else {
      return Response.json({
        status: 'error',
        message: 'Database connection failed',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database test error:', error);
    return Response.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
