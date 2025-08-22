import {Request, Response} from 'express';
import {PostViewModel} from "../../Dto/PostViewModel";
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/httpSatuses";

export const getAllPosts = (req:Request, res:Response) => {
    const findAllPosts = postRepository.findAllPosts();
    res.status(HttpStatuses.Ok_200).send(findAllPosts);
}

