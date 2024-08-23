import { userModel } from "../database/models/user/user.model";
import UserRepository from "./user/user.repository";

const userRepository = new UserRepository(userModel);

export { userRepository, UserRepository };
