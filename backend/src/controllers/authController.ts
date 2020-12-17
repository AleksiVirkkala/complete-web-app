import { RequestHandler as RH } from 'express';
import User from '../models/user';

const signup_get: RH = (req, res) => res.render('signup', { title: 'sign up' });

const signup_post: RH = async (req, res) => {
  const { name, email, password }: { [k: string]: string } = req.body;
  try {
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(400).send('error, user not created');
  }
};

const login_get: RH = (req, res) => res.render('login', { title: 'log in' });

const login_post: RH = async (req, res) => {
  const { email, password }: { [k: string]: string } = req.body;
  console.table({ email, password });

  const matchingUser = await User.findOne({ email, password });

  console.log(matchingUser);

  if (matchingUser) res.send(matchingUser);
  else res.send(401);
};

export { signup_get, signup_post, login_get, login_post };
