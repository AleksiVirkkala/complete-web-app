import type { Server } from 'http';
import mongoose from 'mongoose';

export function createServerShutdownHandler(server: Server) {
  return async () => {
    try {
      // console.log('\nDisconnecting db...');
      await mongoose.disconnect();
      console.log('db disconnected');
    } catch (err) {
      console.log('Disconnecting db failed!');
      console.error(err);
    }
    try {
      // console.log('Shutting down server...');
      await new Promise((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve(undefined)));
      });
      console.log('Server closed');
    } catch (err) {
      console.log('Closing server failed!');
      console.error(err);
    }
  };
}

export async function connectDB() {
  const DB_URL = process.env.DB_URL!;
  await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('db connected');
}
