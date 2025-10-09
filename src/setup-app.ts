import express, {Express} from 'express';
import {blogRouter} from "./blogs/routes/blogRouter";
import {postRouter} from "./posts/router/postRouter";
import {testingRouter} from "./testing/testingRouter";
import {
  AUTH_PATHS,
  BLOGS_PATHS,
  COMMENT_PATHS,
  POST_PATHS,
  SECURITY_PATHS,
  TESTING_PATHS,
  USER_PATHS
} from "./core/paths/paths";
import {authRouter} from "./auth/routes/auth.router";
import {userRouter} from "./users/routes/user-router";
import {commentRouter} from "./comments/routes/comment-router";
import cookieParser from "cookie-parser";
import {devicesRouter} from "./security/router/deviceRouter";

export const setupApp = (app:Express) => {
  app.use(express.json());
  app.use(cookieParser())

  app.use(BLOGS_PATHS,blogRouter )
  app.use(POST_PATHS, postRouter )
  app.use(TESTING_PATHS, testingRouter);
  app.use(AUTH_PATHS, authRouter);
  app.use(USER_PATHS, userRouter);
  app.use(COMMENT_PATHS, commentRouter);
  app.use(SECURITY_PATHS,devicesRouter)
  return app


};
