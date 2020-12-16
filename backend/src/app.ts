import express from 'express';
import morgan from 'morgan';
import { startServer } from './utils';
import blogRoutes from './routes/blogRoutes';

// Express app
const app = express();

// Register view engine
app.set('view engine', 'ejs');

// Middleware & static files
app.use(express.static('../frontend/public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Home' }));
app.get('/about', (req, res) => res.render('about', { title: 'About' }));
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => res.status(404).render('404', { title: '404' }));

// Starting server
startServer(app);
