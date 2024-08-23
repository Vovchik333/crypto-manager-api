import { userModel } from "../database/models/user.model.js";
import UserRepository from "./user/user.repository.js";

const userRepository = new UserRepository(userModel);

export { userRepository };