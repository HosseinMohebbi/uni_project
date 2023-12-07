import * as Joi from 'joi';

export const configSchemaValidation = Joi.object({
  APP_KEY: Joi.string().required(),

  APP_NAME: Joi.string().required(),
  APP_VERSION: Joi.string().required().default('1.0.0'),
  APP_DESCRIPTION: Joi.string().required(),
  APP_TAGS: Joi.string().required(),

  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000).required(),

  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB_PORT: Joi.number().default(5432).required(),
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),

  REDIS_TTL: Joi.number().default(3600),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379).required(),

  JWT_SECRET: Joi.string().required(),
  EXPIRED_AT_REFRESH_TOKEN: Joi.string().required(),
  EXPIRED_AT_ACCESS_TOKEN: Joi.string().required(),
  EXPIRED_AT_AUTH_TOKEN: Joi.string().required(),
  SECRET_REFRESH_TOKEN: Joi.string().required(),
  SECRET_ACCESS_TOKEN: Joi.string().required(),
  SECRET_ACCESS_AUTH: Joi.string().required(),

  THROTTLE_TTL: Joi.number().required().default(60),
  THROTTLE_LIMIT: Joi.number().required().default(100),
});
