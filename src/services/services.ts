import { userRepository } from "../data/repositories/repositories.js";
import UserService from "./user/user.service.js";

const userService = new UserService(userRepository);

export { userService };