import { RequestHandler as RH } from 'express';
import Blog from '../models/blog';

const signup_get: RH = (req, res) => res.render('signup', { title: 'sign up' });

const signup_post: RH = (req, res) => {
  const { email, password }: { [k: string]: string } = req.body;
  console.table({ email, password });
  res.send({ email, password });
};

const login_get: RH = (req, res) => res.render('login', { title: 'log in' });

const login_post: RH = (req, res) => {
  const { email, password }: { [k: string]: string } = req.body;
  console.table({ email, password });
  res.send({ email, password });
};

export { signup_get, signup_post, login_get, login_post };
