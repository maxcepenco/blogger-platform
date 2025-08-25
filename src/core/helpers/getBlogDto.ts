import {BlogInputModel} from "../../blogs/Dto/BlogInputModel";


export function getBlogDto():BlogInputModel {
    return {
        name: 'Example 4',
        description: 'Example description 4',
        webSiteUrl: 'https://example4.com',
    }
}