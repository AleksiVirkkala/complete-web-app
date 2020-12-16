import express from 'express';
import morgan from 'morgan';
import { createServerShutdownHandler, connectDB } from './utils';
import blogRoutes from './routes/blogRoutes';

// Express app
const app = express();

// Register view engine
app.set('view engine', 'ejs');

// Middleware & static files
app.use(express.static('../frontend/public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.redirect('/blogs'));
app.get('/about', (req, res) => res.render('about', { title: 'About' }));
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => res.status(404).render('404', { title: '404' }));

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
