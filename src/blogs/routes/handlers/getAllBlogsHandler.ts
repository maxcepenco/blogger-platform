import {Request, Response} from "express";
import {blogRepository} from "../../repository/blogRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {mapToBlogViewModel} from "../mappers/mapToBlogViewModel";

export const getAllBlogs =async ( req:Request, res:Response ) => {
    const foundBlogs = await blogRepository.findAllBlogs()
    const blogsViewModel = foundBlogs.map(mapToBlogViewModel)
    res.status(HttpStatuses.Ok_200).send(blogsViewModel);
}