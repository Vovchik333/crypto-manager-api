import { userService } from "../services/services.js";
import UserController from "./user/user.controller.js";

const userController = new UserController(userService);

export { userController };
