import express from "express"
import {setupApp} from "./setup-app"
import {runDB} from "./db/mongoDB";
import {SETTINGS} from "./core/settings/settings";


const bootstrap = async () => {
  const app = express();

  app.set('trust proxy', true);

  setupApp(app);

  const PORT = SETTINGS.PORT

  await runDB(SETTINGS.MONGO_URL)
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
  })
  return app;
}

bootstrap()
