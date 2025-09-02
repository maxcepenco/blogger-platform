import express, {Express} from 'express';
import {blogRouter} from "./blogs/routes/blogRouter";
import {postRouter} from "./posts/router/postRouter";
import {testingRouter} from "./testing/testingRouter";
import {BLOGS_PATHS, POST_PATHS, TESTING_PATHS} from "./core/paths/paths";

//-------------------------------------Crud endpoint-------------------------------------------------------
export const setupApp = (app:Express) => {
  app.use(express.json());

  app.use(BLOGS_PATHS,blogRouter )
  app.use(POST_PATHS, postRouter )
  app.use(TESTING_PATHS, testingRouter);
  return app


};
