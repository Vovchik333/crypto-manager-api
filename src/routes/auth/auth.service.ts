import { UserRepository } from "@routes/user";
import { ErrorMessage } from "@enums";
import { SignInPayload, SignUpPayload, UserWithToken, User } from "@types";
import { mapMongoObject } from "@lib/database";
import { HttpCode, HttpError } from "@lib/services/http";
import { hashService } from "@lib/services/hash";
import { jwtService } from "@lib/services/jwt";

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

        payload.password = await hashService.hashData(payload.password);
        const userFromDb = await this.#userRepository.create(payload);
        const user = mapMongoObject<User>(userFromDb);

        return {
            user,
            accessToken: jwtService.signJwt({ id: user.id })
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

        const user = mapMongoObject<User>(userFromDb); 
        const isMatch = hashService.compare(payload.password, user.password);

        if(!isMatch) {
            throw new HttpError({
                status: HttpCode.BAD_REQUEST,
                message: ErrorMessage.INCORRECT_PASSWORD
            });
        }

        return {
            user,
            accessToken: jwtService.signJwt({ id: user.id })
        };
    }
}

export { AuthService };
