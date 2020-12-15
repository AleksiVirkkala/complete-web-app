import express from 'express';
import { createServerShutdownHandler } from './utils';

// Express app
const app = express();

const hostName = process.env.HOST_NAME!;
const port = parseInt(process.env.PORT!);

// Listen for requests
const server = app.listen(port, hostName, () => console.log(`Server running at: http://${hostName}:${port}`));
const shutdownHandler = createServerShutdownHandler(server);

app.get('/html', (req, res) => {
  res.send('<p>HTML Page</p>');
});

app.get('/json', (req, res) => {
  res.send({ message: 'Hello!' });
});

// Handles ctrl + C exit
process.on('SIGINT', shutdownHandler);
// Handles Nodemon restarts
process.once('SIGUSR2', shutdownHandler);
