import express from 'express';
// Plugins
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// Own middleware
import { startServer } from 'utils';
import { requireAuth } from 'middleware/authMiddleware';
// Routes
import authRoutes from 'routes/authRoutes';
import blogRoutes from 'routes/blogRoutes';

// Express app
const app = express();

// Register view engine
app.set('view engine', 'ejs');

// Middleware & static file handling
app.use(express.static('../frontend/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use(authRoutes);
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/about', (req, res) => res.render('about', { title: 'About' }));
app.use('/blogs', requireAuth, blogRoutes);
app.use((req, res) => res.status(404).render('404', { title: '404' })); // 404 page

startServer(app);
