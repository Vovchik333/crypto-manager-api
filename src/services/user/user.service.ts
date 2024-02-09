import { UpdateQuery } from "mongoose";
import { User } from "../../common/types/user/user.type.js";
import UserRepository from "../../data/repositories/user/user.repository.js";

class UserService {
    #userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.#userRepository = userRepository;
    }

    public create(payload: User): Promise<User> {
        return this.#userRepository.create(payload);
    }

    public async getById(id: string): Promise<User | null> {
        return await this.#userRepository.getById(id);
    }

    public updateById(id: string, payload: UpdateQuery<User>): Promise<User | null> {
        return this.#userRepository.updateById(id, payload);
    }

    public deleteById(id: string): Promise<User | null> {
        return this.#userRepository.deleteById(id);
    }
}

export default UserService;