import 'reflect-metadata';
import {Container} from 'inversify';
import {UserRepository} from "./users/repository/user.repository";
import {UserService} from "./users/domain/user-service";
import {UserQueryRepository} from "./users/repository/user.query-repository";
import {UserController} from "./users/controller/user-controller";
import {BlogRepository} from "./blogs/repository/blog.repository";
import {BlogQueryRepository} from "./blogs/repository/blog.query-repository";
import {BlogService} from "./blogs/domain/blog.servece";
import {PostRepository} from "./posts/repository/post.repository";
import {PostQueryRepository} from "./posts/repository/post.query-repository";
import {PostService} from "./posts/domain/post.service";
import {BlogController} from "./blogs/controller/blog-controller";
import {PostController} from "./posts/controller/postController";
import {CommentRepository} from "./comments/repository/commnet-repository";
import {CommentQueryRepository} from "./comments/repository/comment-query-repository";
import {CommentService} from "./comments/domain/commnetService";
import {CommentController} from "./comments/controller/comment-controller";
import {SessionRepository} from "./auth/repository/session-repository";
import {AuthService} from "./auth/domain/auth.service";
import {AuthController} from "./auth/controller/auth-controller";
import {DeviceService} from "./security/domain/divice-service";
import {DeviceController} from "./security/controller/deviceController";



export const container = new Container();
container.bind(SessionRepository).to(SessionRepository)
container.bind(AuthService).to(AuthService)
container.bind(AuthController).to(AuthController)

container.bind(BlogRepository).to(BlogRepository)
container.bind(BlogQueryRepository).to(BlogQueryRepository)
container.bind(BlogService).to(BlogService)
container.bind(BlogController).to(BlogController)

container.bind(CommentRepository).to(CommentRepository)
container.bind(CommentQueryRepository).to(CommentQueryRepository)
container.bind(CommentService).to(CommentService)
container.bind(CommentController).to(CommentController)

container.bind(PostController).to(PostController)
container.bind(PostService).to(PostService)
container.bind(PostRepository).to(PostRepository)
container.bind(PostQueryRepository).to(PostQueryRepository)

container.bind(UserRepository).to(UserRepository)
container.bind(UserQueryRepository).to(UserQueryRepository)
container.bind(UserService).to(UserService)
container.bind(UserController).to(UserController)

container.bind(DeviceService).to(DeviceService);
container.bind(DeviceController).to(DeviceController);