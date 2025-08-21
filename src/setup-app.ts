import express, {Express} from 'express';

//-------------------------------------Crud endpoint-------------------------------------------------------
export const setupApp = (app:Express) => {
  app.use(express.json());

  app.use('/blogs', )
  app.use('/testing', )

  return app


};