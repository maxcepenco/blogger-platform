import {RequestWithParamsAndBody} from "../../../core/types/RequestInputType";
import {blogPostInput} from "../../input/blog-post-input-model";
import {UriParamsInputDto} from "../../../core/types/InputIUriParamsModel";
import {postService} from "../../../posts/application/post.service";
import {mapPostToViewModel} from "../../../posts/router/mappers/mapPostToViewModel";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";


export const createPostForBlog = async (req:RequestWithParamsAndBody<{ blogId:string }, blogPostInput>,res:Response) => {
    try{  const   blogId = req.params.blogId;
        const     postData = req.body;

        const newPost =  await postService.createPostForBlog(blogId, postData);

        const foundCreatedPost = await postService.findById(newPost)
        const postOutput = mapPostToViewModel(foundCreatedPost)
        res.status(HttpStatuses.Created_201).send(postOutput)
    }catch (error) {
        res.sendStatus(HttpStatuses.NotFound_404)
    }
}