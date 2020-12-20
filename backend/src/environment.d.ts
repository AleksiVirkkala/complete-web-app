declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      HOST_NAME: string;
      PORT: string;
      DB_URL: string;
      JWT_MAX_AGE: string;
      JWT_SECRET: string;
    }
  }
}
export {};
