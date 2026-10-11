export const config = {
  port: Number(process.env.PORT ?? 3000),
  bodyLimit: process.env.BODY_LIMIT ?? '32kb',
  databaseUrl: process.env.DATABASE_URL ?? 'postgresql://healthcare:healthcare_dev_password@localhost:5432/healthcare'
};
