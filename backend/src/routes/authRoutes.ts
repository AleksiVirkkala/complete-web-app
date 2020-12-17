import { Router } from 'express';
import * as ac from '../controllers/authController';

export default Router()
  .get('/signup', ac.signup_get)
  .post('/signup', ac.signup_post)
  .get('/login', ac.login_get)
  .post('/login', ac.login_post);
