import {db} from "../db/db";
import {HttpStatuses} from "../core/httpSatuses";
import {Request, Response, Router} from "express";

export const testingRouter = Router({});

testingRouter.delete('/all-data' ,(req:Request,res:Response)=>{
    db.blogs = []
    res.sendStatus(HttpStatuses.NoContent_204)
})