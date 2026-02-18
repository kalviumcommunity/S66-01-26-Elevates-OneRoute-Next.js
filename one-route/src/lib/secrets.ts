import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { logger } from './logger';

const region = process.env.AWS_REGION || 'eu-north-1';
const client = new SecretsManagerClient({ region });

interface AppSecrets {
  [key: string]: string;
}

let cachedSecrets: AppSecrets | null = null;
let secretsLastFetched: number = 0;
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Retrieve secrets from AWS Secrets Manager
 * Includes caching to reduce API calls
 */
export async function getSecrets(): Promise<AppSecrets> {
  try {
    // Return cached secrets if still valid
    if (cachedSecrets && Date.now() - secretsLastFetched < CACHE_TTL) {
      logger.info('Returning cached secrets', { cacheAge: Date.now() - secretsLastFetched });
      return cachedSecrets;
    }

    const secretArn = process.env.SECRET_ARN;
    if (!secretArn) {
      throw new Error('SECRET_ARN environment variable not set');
    }

    logger.info('Fetching secrets from AWS Secrets Manager', { secretArn });

    const command = new GetSecretValueCommand({ SecretId: secretArn });
    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error('No SecretString found in Secrets Manager response');
    }

    cachedSecrets = JSON.parse(response.SecretString);
    secretsLastFetched = Date.now();

    logger.info('Successfully retrieved secrets from AWS Secrets Manager', {
      secretKeys: Object.keys(cachedSecrets),
    });

    return cachedSecrets;
  } catch (error) {
    logger.error('Failed to retrieve secrets from AWS Secrets Manager', {
      error: error instanceof Error ? error.message : String(error),
      secretArn: process.env.SECRET_ARN,
    });
    throw error;
  }
}

/**
 * Get a specific secret by key
 */
export async function getSecret(key: string): Promise<string> {
  const secrets = await getSecrets();
  const value = secrets[key];

  if (!value) {
    throw new Error(`Secret key "${key}" not found in Secrets Manager`);
  }

  return value;
}

/**
 * Clear the secrets cache (useful for manual rotation)
 */
export function clearSecretsCache(): void {
  cachedSecrets = null;
  secretsLastFetched = 0;
  logger.info('Secrets cache cleared');
}

/**
 * Validate that secrets are accessible at runtime
 */
export async function validateSecretsAccess(): Promise<boolean> {
  try {
    const secrets = await getSecrets();
    const secretCount = Object.keys(secrets).length;
    logger.info('✓ Secrets validation successful', { secretCount });
    return true;
  } catch (error) {
    logger.error('✗ Secrets validation failed', {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
