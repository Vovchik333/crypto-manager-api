import { UpdateQuery } from "mongoose";
import { User } from "../../common/types/user/user.type.js";
import UserRepository from "../../data/repositories/user/user.repository.js";
import { jwtManager } from "../../helpers/jwt/jwt-manager.js";
import HttpError from "../../helpers/error/http.error.js";
import { HttpCode } from "../../common/enums/http/http-code.enum.js";
import { UserWithToken } from "../../common/types/user/user-with-token.type.js";

class UserService {
    #userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.#userRepository = userRepository;
    }

    public async create(payload: User): Promise<UserWithToken> {
        const user = await this.#userRepository.create(payload);

        return {
            user: {...user},
            accessToken: jwtManager.signJwt({ id: user._id })
        };
    }

    public async getById(id: string): Promise<User | null> {
        const user = await this.#userRepository.getById(id);

        if (!user) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: 'User not found'
            });
        }

        return user;
    }

    public async updateById(id: string, payload: UpdateQuery<User>): Promise<User | null> {
        const isUserExists = Boolean(await this.#userRepository.getByEmail(payload.email));

        if (isUserExists) {
            throw new HttpError({
                status: HttpCode.BAD_REQUEST,
                message: 'A user with this email already exists'
            });
        }

        const user = await this.#userRepository.updateById(id, payload);
        
        if (!user) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: 'User not found'
            });
        }

        return user;
    }

    public deleteById(id: string): Promise<User | null> {
        const user = this.#userRepository.deleteById(id);

        if (!user) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: 'User not found'
            });
        }

        return user;
    }
}

export default UserService;