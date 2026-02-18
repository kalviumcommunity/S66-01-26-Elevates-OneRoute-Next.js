import { getSecrets, validateSecretsAccess } from '@/lib/secrets';
import { sendSuccess, sendError } from '@/lib/responseHandler';

export async function GET(req: Request) {
  try {
    const isValid = await validateSecretsAccess();

    if (!isValid) {
      return sendError(
        'Failed to validate secrets access',
        { status: 'error' },
        500
      );
    }

    const secrets = await getSecrets();
    const secretKeys = Object.keys(secrets);

    return sendSuccess(
      {
        status: 'success',
        message: 'Secrets retrieved successfully from AWS Secrets Manager',
        secretCount: secretKeys.length,
        secretKeys: secretKeys, // Show what secrets are available (not the values!)
        timestamp: new Date().toISOString(),
      },
      'Secrets validation successful'
    );
  } catch (error) {
    console.error('Secrets validation error:', error);
    return sendError(
      'Failed to retrieve secrets',
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
      },
      500
    );
  }
}
