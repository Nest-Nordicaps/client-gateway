import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;

  NATS_SERVERS: string;
}

const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  NATS_SERVERS: Joi.array().items(Joi.string()).required(),
  // PRODUCTS_MICROSERVICE_HOST: Joi.string().required(),
  // PRODUCTS_MICROSERVICE_PORT: Joi.number().required(),
}).unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
//Le asignamos "EnvVars" a la variable "envsVars" para que tenga tipado
const envsVars: EnvVars = value;

export const envs = {
  port: envsVars.PORT,

  natsServers: envsVars.NATS_SERVERS,
};
