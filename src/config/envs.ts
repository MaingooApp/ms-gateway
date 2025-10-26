import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  CORS_ORIGINS: string[];
  RATE_LIMIT_TTL: number;
  RATE_LIMIT_LIMIT: number;

  NATS_SERVERS: string[];

  JWT_SECRET?: string;
  JWKS_PATH?: string;
  JWT_ISSUER?: string;
  JWT_AUDIENCE?: string;

  REQUEST_TIMEOUT_MS: number;
}

const envSchema = joi
  .object<EnvVars>({
    PORT: joi.number().integer().positive().required(),
    CORS_ORIGINS: joi
      .array()
      .items(joi.string())
      .default(['*']),
    RATE_LIMIT_TTL: joi.number().integer().positive().default(60),
    RATE_LIMIT_LIMIT: joi.number().integer().positive().default(100),

    NATS_SERVERS: joi.array().items(joi.string().uri()).min(1).required(),

    JWT_SECRET: joi.string(),
    JWKS_PATH: joi.string(),
    JWT_ISSUER: joi.string().default('maingoo'),
    JWT_AUDIENCE: joi.string().default('maingoo-clients'),

    REQUEST_TIMEOUT_MS: joi.number().integer().positive().default(5000)
  })
  .oxor('JWT_SECRET', 'JWKS_PATH')
  .unknown(true);

const { error, value } = envSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env['NATS_SERVERS']?.split(',').map((item) => item.trim()),
  CORS_ORIGINS: process.env['CORS_ORIGINS']?.split(',').map((item) => item.trim())
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars = value as EnvVars;

export const envs = {
  port: envVars.PORT,
  corsOrigins: envVars.CORS_ORIGINS,
  rateLimitTtl: envVars.RATE_LIMIT_TTL,
  rateLimitLimit: envVars.RATE_LIMIT_LIMIT,

  natsServers: envVars.NATS_SERVERS,

  jwtSecret: envVars.JWT_SECRET,
  jwksPath: envVars.JWKS_PATH,
  jwtIssuer: envVars.JWT_ISSUER,
  jwtAudience: envVars.JWT_AUDIENCE,

  requestTimeoutMs: envVars.REQUEST_TIMEOUT_MS
};
