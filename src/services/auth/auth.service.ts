import { UserRepository } from "@repositories";
import { hashManager, HttpError, jwtManager, mongoObjectMapper } from "@helpers";
import { HttpCode, ErrorMessage } from "@enums";
import { SignInPayload, SignUpPayload, UserWithToken, User } from "@types";

class AuthService {
    #userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.#userRepository = userRepository;
    }

    public async signUp(payload: SignUpPayload): Promise<UserWithToken> {
        const isUserExists = await this.#userRepository.getByEmail(payload.email) !== null;

        if (isUserExists) {
            throw new HttpError({
                status: HttpCode.BAD_REQUEST,
                message: ErrorMessage.USER_WITH_EXISTING_EMAIL
            });
        }

        payload.password = await hashManager.hashData(payload.password);
        const userFromDb = await this.#userRepository.create(payload);
        const user = mongoObjectMapper<User>(userFromDb);

        return {
            user,
            accessToken: jwtManager.signJwt({ id: user.id })
        };
    }

    public async signIn(payload: SignInPayload): Promise<UserWithToken> {
        const userFromDb = await this.#userRepository.getByEmail(payload.email);

        if (userFromDb === null) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: ErrorMessage.NOT_FOUND
            });
        }

        const user = mongoObjectMapper<User>(userFromDb); 
        const isMatch = hashManager.compare(payload.password, user.password);

        if(!isMatch) {
            throw new HttpError({
                status: HttpCode.BAD_REQUEST,
                message: ErrorMessage.INCORRECT_PASSWORD
            });
        }

        return {
            user,
            accessToken: jwtManager.signJwt({ id: user.id })
        };
    }
}

export default AuthService;