import {Post} from "../domain/Post";
import {blogPostInput} from "../../blogs/input/blog-post-input-model";
import {PostInputModel} from "../input/post-input-model"; // добавьте этот импорт
import {Result} from "../../core/result/result-type";
import {ResultStatus} from "../../core/result/result-code";
import {PostRepository} from "../repository/post.repository";
import {BlogRepository} from "../../blogs/repository/blog.repository";

export class PostService {
    private blogRepository: BlogRepository;
    private postRepository: PostRepository

    constructor() {
        this.blogRepository = new BlogRepository()
        this.postRepository = new PostRepository()
    }


    async createPost(dto: PostInputModel): Promise<Result<string | null>> {

        const blogData = await this.blogRepository.findById(dto.blogId)
        if (!blogData) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: {
                    errorsMessages: [{
                        field: 'blog',
                        message: 'no blog id'
                    }]
                },
                data: null,

            }
        }
        const newPost = new Post(dto.title,
            dto.shortDescription,
            dto.content,
            blogData._id.toString(),
            blogData.name,
            new Date().toISOString())


        const resultCreate = await this.postRepository.createPost(newPost);
        return {
            status: ResultStatus.Success,
            data: resultCreate,
        }
    }

    async updatePost(id: string, dto: PostInputModel): Promise<boolean> {

        return await this.postRepository.updatePost(id, dto)
    }

    async deletePost(id: string): Promise<boolean> {

        return await this.postRepository.deletePost(id)
    }

    async createPostForBlog(blogIdData: string, blogName: string, postData: blogPostInput): Promise<string> {

        const newPost: Post = {
            title: postData.title,
            shortDescription: postData.shortDescription,
            content: postData.content,
            blogId: blogIdData,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }

        return await this.postRepository.createPost(newPost)
    }

}

