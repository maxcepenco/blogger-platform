import {Blog} from "../blogs/Dto/Blog";
import {Post} from "../posts/Dto/Post";


export const db = {
    blogs:<Blog[]> [
        {
            id: '1',
            name: 'example 1',
            description: 'Example blog',
            webSiteUrl:  'https://example.com',
        },
        {
            id: '2',
            name: 'example 2',
            description: 'Example blog 2',
            webSiteUrl:  'https://example2.com',
        },
        {
            id: '3',
            name: 'example 3',
            description: 'Example blog 3',
            webSiteUrl:  'https://example3.com',
        }
    ],
    posts:<Post[]> [
        {
            id: '1',
            title: 'Example post 1',
            shortDescription: 'Post1',
            content: 'content1',
            blogId:  '1',
            blogName: 'Example blog 1',
        },
        {
            id: '1',
            title: 'Example post 1',
            shortDescription: 'Post1',
            content: 'content1',
            blogId:  '1',
            blogName: 'Example blog 1',
        },
        {
            id: '1',
            title: 'Example post 1',
            shortDescription: 'Post1',
            content: 'content1',
            blogId:  '1',
            blogName: 'Example blog 1',
        }

    ]
}