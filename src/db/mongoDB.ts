import {Collection, Db, MongoClient} from "mongodb";
import {Post} from "../posts/dto/Post";
import {Blog} from "../blogs/dto/Blog";
import {SETTINGS} from "../core/settings/settings";
import {UserAccountDBType} from "../users/types-user/UserAccountDBType";
import {CommentDbType} from "../comments/types/comment-db-type";
import {CreateSessionDto} from "../auth/dto/session-DB-type";
import {UserRequest} from "../core/types/request-limiter";
import * as mongoose from "mongoose";


const BLOG_COLLECTIONS_NAME = 'blogs'
const POST_COLLECTIONS_NAME = 'posts'
const USER_COLLECTIONS_NANE = 'users'
const COMMENT_COLLECTIONS_NAME = 'comments'
const REFRESH_TOKEN_COLLECTIONS_NAME = 'refresh_token'
const REQUEST_LOGS_COLLECTIONS_NAME = 'request_logs'

export let client: MongoClient;
export let blogCollection: Collection<Blog>
export let postCollection: Collection<Post>
export let userCollection: Collection<UserAccountDBType>
export let commentCollection: Collection<CommentDbType>
export let refreshTokenCollection: Collection<CreateSessionDto>
export let requestLogsCollection: Collection<UserRequest>


export const runDB = async (url: string): Promise<void> => {
    client = new MongoClient(url)
    const db: Db = client.db(SETTINGS.DB_NAME)

    blogCollection = db.collection<Blog>(BLOG_COLLECTIONS_NAME)
    postCollection = db.collection<Post>(POST_COLLECTIONS_NAME)
    userCollection = db.collection<UserAccountDBType>(USER_COLLECTIONS_NANE)
    commentCollection = db.collection<CommentDbType>(COMMENT_COLLECTIONS_NAME)
    refreshTokenCollection = db.collection<CreateSessionDto>(REFRESH_TOKEN_COLLECTIONS_NAME)
    requestLogsCollection = db.collection<UserRequest>(REQUEST_LOGS_COLLECTIONS_NAME)


    try {
        await mongoose.connect(url, {dbName: SETTINGS.DB_NAME})
        console.log("Connected to database via Mongoose")
    } catch (e) {
        await mongoose.disconnect()
        throw new Error(`Database not connected: ${e}`)
    }


}


export async function stopDb() {
    await mongoose.disconnect()

    console.log("Disconnected")
}

export async function drop(): Promise<void> {
    try {
        await mongoose.connection.dropDatabase()
        console.log("All collections dropped successfully")
    } catch (e: unknown) {
        console.error("Error dropping database:", e);
        throw e;
    }
}

