import { userRepository } from "../repositories";
import AuthService from "./auth/auth.service";
import UserService from "./user/user.service";

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);

export { 
    userService,
    authService,
    AuthService,
    UserService
 };