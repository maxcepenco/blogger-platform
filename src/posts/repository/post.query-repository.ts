import {ObjectId, WithId} from "mongodb";
import {Post} from "../dto/Post";
import {postCollection} from "../../db/mongoDB";
import {PostQueryInput} from "../types/input/post-query.input";
import {SortDirection} from "../../core/types/sort-direction";
import {PostViewModel} from "../types/output/PostViewModel";
import {PaginateQueryOutput} from "../../core/types/pagination-output-model";
import {injectable} from "inversify";

@injectable()
export class PostQueryRepository {

    async findMany(inputParams: PostQueryInput): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = inputParams;
        const skip = (pageNumber - 1) * pageSize;
        const filter = {}
        const mongoSortDirection = sortDirection === SortDirection.Asc ? 1 : -1;
        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({[sortBy]: mongoSortDirection})
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection
                .countDocuments(filter)
        ])
        return {items, totalCount}
    }

    async findPostByBlog(queryDto:PostQueryInput, blogId: string): Promise< {items: WithId<Post>[]; totalCount: number}> {

        const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

        const filter = { blogId: blogId };
        const skip = (pageNumber - 1) * pageSize;
        const mongoSortDirection = sortDirection === SortDirection.Asc ? 1 : -1;

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({ [sortBy]: mongoSortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);
        return { items, totalCount };
    }

    async findPostById(id: string): Promise<PostViewModel | null> {

        const result = await postCollection.findOne({_id: new ObjectId(id)});

        if (!result) {

            return null
        }
        return this.mapPostToViewModel(result);
    }


    mapPostToViewModel(post: WithId<Post>): PostViewModel {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }
    }

    mapToPostListPaginationOutput(
        items: WithId<Post>[],
        pageNumber: number,
        pageSize: number,
        totalCount: number

    ): PaginateQueryOutput<PostViewModel> {
        const pagesCount = Math.ceil(totalCount/ pageSize);

        return {
            pagesCount,
            page:pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items.map(this.mapPostToViewModel)
        }
    }
}

