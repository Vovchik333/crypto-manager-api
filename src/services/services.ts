import { userRepository } from "../data/repositories/repositories.js";
import AuthService from "./auth/auth.service.js";
import UserService from "./user/user.service.js";

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);

export { 
    userService,
    authService
 };