import express from 'express';
import { createServerShutdownHandler } from './utils';

// Express app
const app = express();

const hostName = process.env.HOST_NAME!;
const port = parseInt(process.env.PORT!);

// Listen for requests
const server = app.listen(port, hostName, () => console.log(`Server running at: http://${hostName}:${port}`));
const shutdownHandler = createServerShutdownHandler(server);

app.get('/', (req, res) => {
  // res.send('<p>Home Page</p>');
  res.sendFile('public/index.html', { root: __dirname });
});

app.get('/about', (req, res) => {
  res.sendFile('public/about.html', { root: __dirname });
});

// Redirects
app.get('/about-us', (req, res) => {
  res.redirect('/about');
});
// 404 page
app.use((req, res) => {
  res.status(404).sendFile('public/404.html', { root: __dirname });
});
// Handles ctrl + C exit
process.on('SIGINT', shutdownHandler);
// Handles Nodemon restarts
process.once('SIGUSR2', shutdownHandler);