import { RequestHandler as RH } from 'express';
import User from '../models/user';
import { Error as mongooseError } from 'mongoose';

// Handle errors
const formatErrors = (err: Error | { code: number }) => {
  if ('code' in err && err.code === 11000) return { email: 'email is already registered' };
  if (err instanceof mongooseError.ValidationError) {
    const errorEntries = Object.entries(err.errors);
    const mappedEntries = errorEntries.map(([path, error]): [string, string] => [path, error.message]);
    return Object.fromEntries(mappedEntries);
  }
};

const signup_get: RH = (req, res) => res.render('auth/signup', { title: 'sign up' });

const signup_post: RH = async (req, res) => {
  const { name, email, password }: { [k: string]: string } = req.body;
  try {
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    const errors = formatErrors(err);
    if (errors) return res.status(400).json(errors);
    return res.status(400).send('error, user not created');
  }
};

const login_get: RH = (req, res) => res.render('auth/login', { title: 'log in' });

const login_post: RH = async (req, res) => {
  const { email, password }: { [k: string]: string } = req.body;
  const matchingUser = await User.findOne({ email, password });
  if (matchingUser) res.send(matchingUser);
  else res.send(401);
};

export { signup_get, signup_post, login_get, login_post };
