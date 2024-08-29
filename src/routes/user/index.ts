import { userModel } from "./user.model";
import UserRepository from "./user.repository";
import UserService from "./user.service";
import UserController from "./user.controller";
import { UserRoute } from "./user.route";

const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const userRoute = new UserRoute(userController);

export { userRepository, userService, userController, userRoute };
export { UserRepository, UserService, UserController, UserRoute };
