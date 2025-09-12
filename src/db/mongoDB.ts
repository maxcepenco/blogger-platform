import {Collection, Db, MongoClient} from "mongodb";
import {Post} from "../posts/domain/Post";
import {Blog} from "../blogs/domain/Blog";
import {SETTINGS} from "../core/settings/settings";
import {User} from "../users/types-user/User";


const BLOG_COLLECTIONS_NAME =  'blogs'
const POST_COLLECTIONS_NAME = 'posts'
const USER_COLLECTIONS_NANE = 'users'

export let client: MongoClient;
export let blogCollection: Collection<Blog>
export let postCollection: Collection<Post>
export let userCollection: Collection<User>

export const runDB = async (url: string): Promise<void> => {
    client = new MongoClient(url)
    const db: Db = client.db(SETTINGS.DB_NAME)

    blogCollection = db.collection<Blog>(BLOG_COLLECTIONS_NAME)
    postCollection = db.collection<Post>(POST_COLLECTIONS_NAME)
    userCollection = db.collection<User>(USER_COLLECTIONS_NANE)

    try{
        await client.connect()
        await db.command({ping: 1})
        console.log("Connected to database")
    }catch(e){
        await client.close()
        throw new Error(`Database not connected: ${e}`)
    }


}


export async function stopDb() {
    if( !client) {
        throw new Error(`Mongo client not connected`)
    }
    await client.close()
}

