import { UpdateQuery } from "mongoose";
import { User } from "@types";
import { ErrorMessage } from "@enums";
import { UserRepository } from "@routes/user";
import { mapMongoObject } from '@lib/database';
import { hashService } from "@lib/services/hash";
import { HttpCode, HttpError } from "@lib/services/http";

class UserService {
    #userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.#userRepository = userRepository;
    }

    public async getById(id: string): Promise<User | null> {
        const user = mapMongoObject<User>(await this.#userRepository.getById(id));

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
            payload.password = await hashService.hashData(payload.password);
        }

        const user = mapMongoObject<User>(await this.#userRepository.updateById(id, payload));

        return user;
    }

    public async deleteById(id: string): Promise<User | null> {
        const user = mapMongoObject<User>(await this.#userRepository.deleteById(id));

        return user;
    }
}

export default UserService;
