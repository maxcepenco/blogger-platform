import express, {Express} from 'express';
import {blogRouter} from "./blogs/router/blogRouter";
import {postRouter} from "./posts/router/postRouter";

//-------------------------------------Crud endpoint-------------------------------------------------------
export const setupApp = (app:Express) => {
  app.use(express.json());

  app.use('/blogs',blogRouter )
  app.use('/testing', postRouter )

  return app


};