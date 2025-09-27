import {RequestWithParamsAndBody} from "../../../core/types/RequestInputType";
import {blogPostInput} from "../../input/blog-post-input-model";
import {postService} from "../../../posts/application/post.service";
import {HttpStatuses} from "../../../core/types/httpSatuses";
import {Response} from "express";
import {blogQueryRepository} from "../../repository/blog.query-repository";
import {postQueryRepository} from "../../../posts/repository/post.query-repository";


export const createPostForBlog = async(req:RequestWithParamsAndBody<{ blogId:string }, blogPostInput>,res:Response) => {
    try{
        const   blogId = req.params.blogId;

        const existingBlog = await blogQueryRepository.findById(blogId);

        if(!existingBlog) {
            res.sendStatus(HttpStatuses.NotFound_404);
            return
        }

       // const postData = req.body;


        const createdPostForId =  await postService.createPostForBlog(blogId,existingBlog.name, req.body);

        const createdPost = await postQueryRepository.findPostById(createdPostForId)
        if(!createdPost) {
            return res.sendStatus(HttpStatuses.NotFound_404);
        }
        res.status(HttpStatuses.Created_201).send(createdPost)
    }catch (error) {
        return res.status(500).json({
            errorsMessages: [{ field: "server", message: "Internal server error" }]
        });    }
}