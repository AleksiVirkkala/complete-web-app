import type { RequestHandler as RH } from 'express';
import { Error as mongooseError, Types as mongooseTypes } from 'mongoose';
import { MongoError } from 'mongodb';
import jwt from 'jsonwebtoken';
import User from 'models/user';

// Handle errors
const formatErrors = (err: unknown) => {
  // Unknown error that shouldn't be handled
  if (!(err instanceof Error)) throw err;

  // Duplicate key error
  if (err instanceof MongoError && err.code === 11000) return { email: 'email is already registered' };

  // Mongoose validation related errors
  if (err instanceof mongooseError.ValidationError) {
    const errorEntries = Object.entries(err.errors);
    const mappedEntries = errorEntries.map(([path, error]): [string, string] => [path, error.message]);
    return Object.fromEntries(mappedEntries);
  } else {
    switch (err.message) {
      case 'incorrect email':
        return { email: err.message };
      case 'incorrect password':
        return { password: err.message };
    }
  }
  throw err; // Re-throwing if none of above handlers match
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
  } catch (err: unknown) {
    const errors = formatErrors(err);
    return res.status(400).json({ errors });
  }
};

const login_get: RH = (req, res) => res.render('auth/login', { title: 'log in' });

const login_post: RH = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: parseInt(process.env.JWT_MAX_AGE) * 1000 });
    return res.json({ user: user._id });
  } catch (err: unknown) {
    const errors = formatErrors(err);
    res.status(400).json({ errors });
  }
};

export { signup_get, signup_post, login_get, login_post };
