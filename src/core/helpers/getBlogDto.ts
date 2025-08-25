import {BlogInputModel} from "../../blogs/Dto/BlogInputModel";


export function getBlogDto():BlogInputModel {
    return {
        name: 'Example 4',
        description: 'Example description 4',
        websiteUrl: 'https://example4.com',
    }
}