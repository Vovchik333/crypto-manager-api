import { User } from "../../common/types/user/user.type.js";
import UserRepository from "../../data/repositories/user/user.repository.js";
import { jwtManager } from "../../helpers/jwt/jwt-manager.js";
import HttpError from "../../helpers/error/http.error.js";
import { HttpCode } from "../../common/enums/http/http-code.enum.js";
import { UserWithToken } from "../../common/types/user/user-with-token.type.js";
import { compareSync, hash } from "bcrypt";
import { SignInPayload } from "../../common/types/sign/sign-in-payload.type.js";
import { SignUpPayload } from "../../common/types/sign/sign-up-payload.type.js";

class AuthService {
    #userRepository: UserRepository;
    #saltRounds = 10;

    constructor(userRepository: UserRepository) {
        this.#userRepository = userRepository;
    }

    public async signUp(payload: SignUpPayload): Promise<UserWithToken> {
        const isUserExists = Boolean(await this.#userRepository.getByEmail(payload.email));

        if (isUserExists) {
            throw new HttpError({
                status: HttpCode.BAD_REQUEST,
                message: 'A user with this email already exists'
            });
        }

        payload.password = await hash(payload.password, this.#saltRounds);
        const user = await this.#userRepository.create(payload as User);

        return {
            user,
            accessToken: jwtManager.signJwt({ id: user._id })
        };
    }

    public async signIn(payload: SignInPayload): Promise<UserWithToken> {
        const user = await this.#userRepository.getByEmail(payload.email);

        if (!user) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: 'User not found'
            });
        }

        const isMatch = compareSync(payload.password, user.password);

        if(!isMatch) {
            throw new HttpError({
                status: HttpCode.BAD_REQUEST,
                message: 'Password is not correct'
            });
        }

        return {
            user,
            accessToken: jwtManager.signJwt({ id: user._id })
        };
    }
}

export default AuthService;