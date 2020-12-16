import { RequestHandler as RH } from 'express';
import Blog from '../models/blog';

const blog_index: RH = (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then(blogs => res.render('blogs/index', { title: 'All Blogs', blogs }))
    .catch(console.log);
};

const blog_details: RH = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => res.render('blogs/details', { title: 'Blog Details', blog: result }))
    .catch(console.log);
};

const blog_create_get: RH = (req, res) => res.render('blogs/create', { title: 'Create a new Blog' });

const blog_create_post: RH = (req, res) => {
  const newBlog = new Blog(req.body);
  newBlog
    .save()
    .then(() => res.redirect('/blogs'))
    .catch(console.log);
};

const blog_delete: RH = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(() => res.send({ redirect: '/blogs' }))
    .catch(console.log);
};

export { blog_index, blog_details, blog_create_get, blog_create_post, blog_delete };
