import { Router } from 'express';
import * as bc from '../controllers/blogController';

export default Router()
  .get('/', bc.blog_index)
  .post('/', bc.blog_create_post)
  .get('/create', bc.blog_create_get)
  .get('/:id', bc.blog_details)
  .delete('/:id', bc.blog_delete);
