describe('Gateway envs', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('parses environment variables', async () => {
    process.env.PORT = '3100';
    process.env.CORS_ORIGINS = 'http://localhost:4200';
    process.env.RATE_LIMIT_TTL = '60';
    process.env.RATE_LIMIT_LIMIT = '100';
    process.env.NATS_SERVERS = 'nats://localhost:4222';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_ISSUER = 'maingoo';
    process.env.JWT_AUDIENCE = 'maingoo-clients';
    process.env.REQUEST_TIMEOUT_MS = '4000';

    const { envs } = await import('./envs');

    expect(envs.port).toBe(3100);
    expect(envs.natsServers).toEqual(['nats://localhost:4222']);
    expect(envs.jwtSecret).toBe('secret');
    expect(envs.requestTimeoutMs).toBe(4000);
  });
});
