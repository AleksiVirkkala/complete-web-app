declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST_NAME: string;
      PORT: string;
      DB_URL: string;
      JWT_MAX_AGE: string;
      JWT_SECRET: string;
    }
  }
}
export {};
