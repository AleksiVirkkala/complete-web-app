import type { Server } from 'http';

export function createServerShutdownHandler(server: Server) {
  return () => {
    console.log('\nShutting down server...\n');
    server.close(err => {
      if (err) {
        console.log('Closing server failed!');
        console.error(err);
      }
    });
  };
}
