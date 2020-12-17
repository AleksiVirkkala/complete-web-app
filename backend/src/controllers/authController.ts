import { RequestHandler as RH } from 'express';
import User from '../models/user';

const signup_get: RH = (req, res) => res.render('signup', { title: 'sign up' });

const signup_post: RH = async (req, res) => {
  const { name, email, password }: { [k: string]: string } = req.body;
  const newUser = new User({ name, email, password });
  try {
    const addedUser = await newUser.save();
    res.send(addedUser);
  } catch (err) {
    console.log(err);
    res.status(400).send('Bad request!');
  }
};

const login_get: RH = (req, res) => res.render('login', { title: 'log in' });

const login_post: RH = (req, res) => {
  const { email, password }: { [k: string]: string } = req.body;
  console.table({ email, password });
  res.send({ email, password });
};

export { signup_get, signup_post, login_get, login_post };
