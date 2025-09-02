import {Request, Response} from 'express';
import {postRepository} from "../../repository/postRepository";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {mapPostToViewModel} from "../mappers/mapPostToViewModel";

export const getAllPosts = async (req:Request, res:Response) => {
    const findAllPosts = await postRepository.findAllPosts();

    const postViewModel = findAllPosts.map(mapPostToViewModel)

    res.status(HttpStatuses.Ok_200).send(postViewModel);
}


