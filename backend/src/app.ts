import express from 'express';
import { createServerShutdownHandler } from './utils';

// Express app
const app = express();

// Register view engine
app.set('view engine', 'ejs');

const hostName = process.env.HOST_NAME!;
const port = parseInt(process.env.PORT!);

// Listen for requests
const server = app.listen(port, hostName, () => console.log(`Server running at: http://${hostName}:${port}`));
const shutdownHandler = createServerShutdownHandler(server);

app.get('/', (req, res) => {
  const blogs = [
    { title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    { title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    { title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur' }
  ];
  res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new Blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// Handles ctrl + C exit
process.on('SIGINT', shutdownHandler);
// Handles Nodemon restarts
process.once('SIGUSR2', shutdownHandler);
