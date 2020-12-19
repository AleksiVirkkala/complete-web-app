import type { RequestHandler as RH } from 'express';
import { Error as mongooseError, Types as mongooseTypes } from 'mongoose';
import jwt from 'jsonwebtoken';
import User from 'models/user';

// Handle errors
const formatErrors = (err: Error | { code: number }) => {
  if ('code' in err && err.code === 11000) return { email: 'email is already registered' };
  if (err instanceof mongooseError.ValidationError) {
    const errorEntries = Object.entries(err.errors);
    const mappedEntries = errorEntries.map(([path, error]): [string, string] => [path, error.message]);
    return Object.fromEntries(mappedEntries);
  }
};

const createToken = (id: mongooseTypes.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_MAX_AGE
  });
};

const signup_get: RH = (req, res) => res.render('auth/signup', { title: 'sign up' });

const signup_post: RH = async (req, res) => {
  const { name, email, password }: { name: string; email: string; password: string } = req.body;

  try {
    const newUser = await User.create({ name, email, password });
    const token = createToken(newUser._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: parseInt(process.env.JWT_MAX_AGE) * 1000 });
    res.status(201).json({ user: newUser._id });
  } catch (err) {
    const errors = formatErrors(err);
    if (errors) return res.status(400).json({ errors });
    return res.status(400).send('error, user not created');
  }
};

const login_get: RH = (req, res) => res.render('auth/login', { title: 'log in' });

const login_post: RH = async (req, res) => {
  const { email } = req.body;
  const matchingUser = await User.findOne({ email });
  if (!matchingUser) return res.status(404).send('user not found');
  else res.send(401);
};

export { signup_get, signup_post, login_get, login_post };
