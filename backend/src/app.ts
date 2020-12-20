import express from 'express';
// Plugins
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// Own middleware
import { startServer } from 'utils';
import { requireAuth, checkUser } from 'middleware/authMiddleware';
// Routes
import authRoutes from 'routes/authRoutes';
import blogRoutes from 'routes/blogRoutes';

// Express app
const app = express();

// Register view engine
app.set('view engine', 'ejs');

// Middleware & static file handling
app
  .use(express.static('../frontend/public'))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(morgan('dev'))
  .use(cookieParser());

// Routes
app
  .get('*', checkUser)
  .use(authRoutes)
  .get('/', (req, res) => res.render('index', { title: 'Home' }))
  .get('/about', (req, res) => res.render('about', { title: 'About' }))
  .get('/fallback', (req, res) => res.render('offlinefallback', { title: 'Not available' }))
  .use('/blogs', requireAuth, blogRoutes)
  .use((req, res) => res.status(404).render('404', { title: '404' })); // 404 page

const init = startServer.bind(this, app);

export { app, startServer };
export default init;
