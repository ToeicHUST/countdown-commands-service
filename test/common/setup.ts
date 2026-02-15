import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

jest.setTimeout(60000);

let postgresContainer: StartedPostgreSqlContainer;

async function startPostgresContainer(): Promise<StartedPostgreSqlContainer> {
  const container = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('test_db')
    .withUsername('test_user')
    .withPassword('test_pass')
    .withExposedPorts(5432)
    .withStartupTimeout(120000)
    .start();

  return container;
}

async function seedSecrets(): Promise<void> {
  process.env.MICROSERVICES_COUNTDOWN_COMMANDS_SERVICE_DATABASE_URL =
    postgresContainer.getConnectionUri();

  process.env.SUPABASE_URL = 'https://toeichust.supabase.co';
}

beforeAll(async () => {
  try {
    [postgresContainer] = await Promise.all([startPostgresContainer()]);

    await seedSecrets();
  } catch (error) {
    console.error('Failed to setup test environment:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await Promise.all([
      postgresContainer?.stop().catch((err) => {
        console.warn(
          'Warning: Failed to stop PostgreSQL container:',
          err.message,
        );
      }),
    ]);
  } catch (error) {
    console.error('Failed to cleanup test environment:', error);
  }

  const app = (global as any).app;
  if (app) {
    await app.close();
    (global as any).app = null;
  }
});
