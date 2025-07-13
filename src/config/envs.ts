import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  API_PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  GOOGLE_API_KEY: string;
  GOOGLE_PLACES_URL: string;
  GOOGLE_GEOCODING_URL: string;
}

const envsSchema = joi
  .object<EnvVars>({
    API_PORT: joi.number().default(3000),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRATION: joi.number().default(3600),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_NAME: joi.string().required(),
    GOOGLE_API_KEY: joi.string().required(),
    GOOGLE_PLACES_URL: joi.string().uri().required(),
    GOOGLE_GEOCODING_URL: joi.string().uri().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(
    `Error en la configuración de las variables de entorno: ${error.message}`,
  );
}

const envVars: EnvVars = value;

export const envs = {
  apiPort: envVars.API_PORT,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiration: envVars.JWT_EXPIRATION,
  dbHost: envVars.DB_HOST,
  dbPort: envVars.DB_PORT,
  dbUsername: envVars.DB_USERNAME,
  dbPassword: envVars.DB_PASSWORD,
  dbName: envVars.DB_NAME,
  googleApiKey: envVars.GOOGLE_API_KEY,
  googlePlacesUrl: envVars.GOOGLE_PLACES_URL,
  googleGeocodingUrl: envVars.GOOGLE_GEOCODING_URL,
};
