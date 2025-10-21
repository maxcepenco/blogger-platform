import {BlogInputModel} from "../types/input/blog-input-model";

import {Blog} from "../dto/Blog";
import {ResultStatus} from "../../core/result/result-code";
import {Result} from "../../core/result/result-type";
import {BlogRepository} from "../repository/blog.repository";
import {inject, injectable} from "inversify";


@injectable()
export class BlogService {

    constructor(@inject(BlogRepository)protected blogRepository: BlogRepository) {}

    async create(blogDto: BlogInputModel): Promise<Result<string>> {

        //class Blog
        const newBlog = new Blog(
            blogDto.name,
            blogDto.description,
            blogDto.websiteUrl,
            new Date().toISOString(),
            false
        )

        const resultCreate = await this.blogRepository.createBlog(newBlog);
        return {
            status: ResultStatus.Success,
            data: resultCreate,
        }

    }


    async updateBlog(id: string, blog: BlogInputModel): Promise<Result<boolean>> {

        const resultUpdate = await this.blogRepository.updateBlog(id, blog)
        return {
            status: ResultStatus.Success,
            data: resultUpdate,
        }

    }


    async deleteBlog(id: string): Promise<Result<boolean>> {

        const resultDelete = await this.blogRepository.deleteBlog(id)
        return {
            status: ResultStatus.Success,
            data: resultDelete,
        }
    }

}

