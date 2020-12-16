import express from 'express';
import Blog from '../models/blog';
const router = express.Router();

router.get('/', async (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then(blogs => res.render('index', { title: 'All Blogs', blogs }))
    .catch(console.log);
});

router.post('/', (req, res) => {
  const newBlog = new Blog(req.body);
  newBlog
    .save()
    .then(() => res.redirect('/blogs'))
    .catch(console.log);
});

router.get('/create', (req, res) => res.render('create', { title: 'Create a new Blog' }));

router.get('/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => res.render('details', { title: 'Blog Details', blog: result }))
    .catch(console.log);
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(() => res.send({ redirect: '/blogs' }))
    .catch(console.log);
});

export default router;
