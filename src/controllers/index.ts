import { authService, userService } from "../services";
import AuthController from "./auth/auth.controller";
import UserController from "./user/user.controller";

const userController = new UserController(userService);
const authController = new AuthController(authService);

export { 
    userController,
    authController
};
