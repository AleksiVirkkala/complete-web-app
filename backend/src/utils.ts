import type { Server } from 'http';
import { Express } from 'express';
import mongoose from 'mongoose';

function createServerShutdownHandler(server: Server) {
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

async function connectDB() {
  const DB_URL = process.env.DB_URL;
  await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  console.log('db connected');
}

export async function startServer(app: Express): Promise<Server> {
  const hostName = process.env.HOST_NAME;
  const port = parseInt(process.env.PORT);
  await connectDB();
  // Listen for requests once db is connected
  const server = app.listen(port, hostName, () => console.log(`Server running at: http://${hostName}:${port}`));
  const shutdownHandler = createServerShutdownHandler(server);
  process.on('SIGINT', shutdownHandler); // Handles ctrl + C exit
  process.once('SIGUSR2', shutdownHandler); // Handles Nodemon restarts
  return server;
}
