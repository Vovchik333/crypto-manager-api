import { authService, userService } from "../services/services.js";
import AuthController from "./auth/auth.controller.js";
import UserController from "./user/user.controller.js";

const userController = new UserController(userService);
const authController = new AuthController(authService);

export { 
    userController,
    authController
 };
