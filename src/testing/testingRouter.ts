import { Request, Response, Router } from 'express'
import {HttpStatuses} from "../core/types/httpSatuses";
import {blogCollection, postCollection} from "../db/mongoDB";

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    //truncate db
    await Promise.all([
        blogCollection.deleteMany(),
        postCollection.deleteMany(),
    ]);
    res.sendStatus(HttpStatuses.NoContent_204);
});