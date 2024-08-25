import { UpdateQuery } from "mongoose";
import { User } from "@types";
import { UserRepository } from "@repositories";
import { hashManager, HttpError, mongoObjectMapper } from "@helpers";
import { HttpCode, ErrorMessage } from "@enums";

class UserService {
    #userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.#userRepository = userRepository;
    }

    public async getById(id: string): Promise<User | null> {
        const userFromDb = await this.#userRepository.getById(id);

        if (userFromDb === null) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: ErrorMessage.NOT_FOUND
            });
        }

        const user = mongoObjectMapper<User>(userFromDb);

        return user;
    }

    public async updateById(id: string, payload: UpdateQuery<User>): Promise<User | null> {
        const isUserExists = await this.#userRepository.getByEmail(payload.email) !== null;

        if (isUserExists) {
            throw new HttpError({
                status: HttpCode.BAD_REQUEST,
                message: ErrorMessage.USER_WITH_EXISTING_EMAIL
            });
        }

        if (typeof payload !== 'undefined' && payload.password !== undefined) {
            payload.password = await hashManager.hashData(payload.password);
        }

        const userFromDb = await this.#userRepository.updateById(id, payload);
        
        if (userFromDb === null) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: ErrorMessage.NOT_FOUND
            });
        }

        const user = mongoObjectMapper<User>(userFromDb);

        return user;
    }

    public async deleteById(id: string): Promise<User | null> {
        const userFromDb = await this.#userRepository.deleteById(id);

        if (userFromDb === null) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: ErrorMessage.NOT_FOUND
            });
        }

        const user = mongoObjectMapper<User>(userFromDb);

        return user;
    }
}

export default UserService;
