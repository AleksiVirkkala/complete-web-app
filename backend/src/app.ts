import express from 'express';
import morgan from 'morgan';
import { createServerShutdownHandler, connectDB } from './utils';
import Blog from './models/blog';

// Express app
const app = express();

// Register view engine
app.set('view engine', 'ejs');

// Middleware & static files
app.use(express.static('../frontend/public'));
app.use(morgan('dev'));

app.post('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'new blog',
    snippet: 'about my new blog',
    body: 'more about my new blog'
  });

  blog
    .save()
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

// Blog routes
app.get('/blogs', async (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then(blogs => res.render('index', { title: 'All Blogs', blogs }))
    .catch(err => console.log(err));
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new Blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

// Starting server
(async () => {
  const hostName = process.env.HOST_NAME!;
  const port = parseInt(process.env.PORT!);
  await connectDB();
  // Listen for requests once db is connected
  const server = app.listen(port, hostName, () => console.log(`Server running at: http://${hostName}:${port}`));
  const shutdownHandler = createServerShutdownHandler(server);
  process.on('SIGINT', shutdownHandler); // Handles ctrl + C exit
  process.once('SIGUSR2', shutdownHandler); // Handles Nodemon restarts
})();
