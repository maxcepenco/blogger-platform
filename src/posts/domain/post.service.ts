import {blogPostInput} from "../../blogs/types/input/blog-post-input-model";
import {PostInputModel} from "../types/input/post-input-model"; // добавьте этот импорт
import {Result} from "../../core/result/result-type";
import {ResultStatus} from "../../core/result/result-code";
import {PostRepository} from "../repository/post.repository";
import {BlogRepository} from "../../blogs/repository/blog.repository";
import {inject, injectable} from "inversify";
import {PostModel} from "../repository/PostModel";


@injectable()
export class PostService {


    constructor(@inject(BlogRepository) protected blogRepository: BlogRepository,
                @inject(PostRepository) protected postRepository: PostRepository) {
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

        const createdPost = new PostModel({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogData._id.toString(),
            blogName: blogData.name,
        })


        const resultCreate = await this.postRepository.saveCreatedPost(createdPost)

        return {
            status: ResultStatus.Success,
            data: resultCreate,
        }
    }

    async createPostForBlog(blogIdDto: string, blogName: string, postDto: blogPostInput): Promise<string> {

        const post = new PostModel({
            title: postDto.title,
            shortDescription: postDto.shortDescription,
            content: postDto.content,
            blogId: blogIdDto,
            blogName: blogName,
        })


        const result = await this.postRepository.saveCreatedPost(post)

        return result
    }

    async updatePost(id: string, dto: PostInputModel): Promise<boolean> {

        const post = await this.postRepository.findById(id)
        if (!post) return false

        post.title = dto.title
        post.shortDescription = dto.shortDescription
        post.content = dto.content
        post.blogId = dto.blogId

        return await this.postRepository.saveUpdatedPost(post)
    }

    async deletePost(id: string): Promise<boolean> {

        const post = await this.postRepository.findById(id)
        if (!post) return false

        const result = await post.deleteOne()

        return result.deletedCount === 1
    }


}

