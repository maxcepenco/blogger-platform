import {UserRepository} from "./users/repository/user.repository";
import {UserService} from "./users/domain/user-service";
import {UserQueryRepository} from "./users/repository/user.query-repository";
import {UserController} from "./users/routes/user-controller";
import {BlogRepository} from "./blogs/repository/blog.repository";
import {BlogQueryRepository} from "./blogs/repository/blog.query-repository";
import {BlogService} from "./blogs/application/blog.servece";
import {PostRepository} from "./posts/repository/post.repository";
import {PostQueryRepository} from "./posts/repository/post.query-repository";
import {PostService} from "./posts/application/post.service";
import {BlogController} from "./blogs/routes/blog-controller";
import {PostController} from "./posts/router/postController";
import {CommentRepository} from "./comments/repository/commnet-repository";
import {CommentQueryRepository} from "./comments/repository/comment-query-repository";
import {CommentService} from "./comments/domain/commnetService";
import {CommentController} from "./comments/routes/comment-controller";
import {SessionRepository} from "./auth/repository/session-repository";
import {AuthService} from "./auth/domain/auth.service";
import {AuthController} from "./auth/routes/auth-controller";
import {DeviceService} from "./security/domain/divice-service";
import {DeviceController} from "./security/router/deviceController";


export const userRepository = new UserRepository()

const userQueryRepository = new UserQueryRepository();

export const blogRepository = new BlogRepository();

const blogQueryRepository = new BlogQueryRepository()

const postRepository = new PostRepository()

const postQueryRepository = new PostQueryRepository()

const commentRepository = new CommentRepository()

const commentQueryRepository = new CommentQueryRepository()

export const sessionRepository = new SessionRepository()


const userService = new UserService(userRepository)

const blogService = new BlogService(blogRepository)

const postService = new PostService(blogRepository,postRepository)

const commentService = new CommentService(commentRepository,userQueryRepository)

export const authService = new AuthService( sessionRepository, userRepository )

const deviceService = new DeviceService(sessionRepository)


export const userController = new UserController( userService, userQueryRepository)

export const blogController = new BlogController( blogService, blogQueryRepository, postService, postQueryRepository)

export const postController = new PostController( postService, postQueryRepository, commentService, commentQueryRepository)

export const commentController = new CommentController( commentService, commentQueryRepository)

export const authController = new AuthController(userQueryRepository, authService )

export const deviceController = new DeviceController(deviceService)