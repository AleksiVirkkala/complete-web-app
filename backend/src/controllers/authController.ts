import { RequestHandler as RH } from 'express';
import Blog from '../models/blog';

const signup_get: RH = (req, res) => res.render('signup', { title: 'sign up' });

const signup_post: RH = (req, res) => res.send('new signup');

const login_get: RH = (req, res) => res.render('login', { title: 'log in' });

const login_post: RH = (req, res) => res.send('user login');

export { signup_get, signup_post, login_get, login_post };
