import {Post} from "../dto/Post";
import {blogPostInput} from "../../blogs/types/input/blog-post-input-model";
import {PostInputModel} from "../types/input/post-input-model"; // добавьте этот импорт
import {Result} from "../../core/result/result-type";
import {ResultStatus} from "../../core/result/result-code";
import {PostRepository} from "../repository/post.repository";
import {BlogRepository} from "../../blogs/repository/blog.repository";
import {inject, injectable} from "inversify";


@injectable()
export class PostService {


    constructor(@inject(BlogRepository) protected blogRepository: BlogRepository,
                @inject(PostRepository) protected postRepository: PostRepository) {}


    async createPost(dto: PostInputModel): Promise<Result<string | null>> {

        const blogData = await this.blogRepository.findById(dto.blogId) //TODO: Должен ходить к BlogQueryRepository
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
        const newPost = new Post(
            dto.title,
            dto.shortDescription,
            dto.content,
            blogData._id.toString(),
            blogData.name,
            new Date()
        )


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
            createdAt: new Date()
        }

        return await this.postRepository.createPost(newPost)
    }

}

