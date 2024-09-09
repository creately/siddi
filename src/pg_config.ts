export const pgConfig = {
    user: process.env.POSTGRES_USER || 'your_default_user',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'your_default_database',
    password: process.env.POSTGRES_PASSWORD || 'your_default_password',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  };