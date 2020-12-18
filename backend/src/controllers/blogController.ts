import { RequestHandler as RH } from 'express';
import Blog from 'models/blog';

const blog_index: RH = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render('blogs/index', { title: 'All Blogs', blogs });
  } catch {
    res.render('404', { title: "Couldn't fetch blogs" });
  }
};

const blog_details: RH = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) return res.render('blogs/details', { title: 'Blog Details', blog });
    throw new Error('Blog not found');
  } catch {
    res.render('404', { title: 'Blog not found' });
  }
};

const blog_create_get: RH = (req, res) => res.render('blogs/create', { title: 'Create a new Blog' });

const blog_create_post: RH = async (req, res) => {
  try {
    await Blog.create(req.body);
    res.redirect('/blogs');
  } catch (err) {
    console.error(err);
    res.status(400).send('error, blog not created');
  }
  const newBlog = new Blog(req.body);
};

const blog_delete: RH = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.send({ redirect: '/blogs' });
  } catch (err) {
    console.error(err);
    res.status(400).send('error, blog not deleted');
  }
};

export { blog_index, blog_details, blog_create_get, blog_create_post, blog_delete };
