
import { envs } from '../src/config/envs';
import { createDatabase } from 'typeorm-extension';

(async () => {
  await createDatabase({
    options: {
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      username: envs.dbUsername,
      password: envs.dbPassword,
      database: envs.dbName,
    },
    ifNotExist: true,
  });
  process.exit(0);
})();
