import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import HttpError from "../error/http.error.js";
import { HttpCode } from "../../common/enums/http/http-code.enum.js";
import { JWT_SECRET } from "../../config/config.js";

class JwtManager {
    #secret: Secret;

    constructor(secret: string) {
        this.#secret = secret;
    }

    public signJwt(payload: string | object | Buffer): string {
        return jwt.sign(payload, this.#secret);
    }

    public verifyJwt(token: string): string | JwtPayload {
        try {
            return jwt.verify(token, this.#secret);
        } catch (err) {
            throw new HttpError({ 
                status: HttpCode.UNAUTHORIZED, 
                message: 'Not Authorized' 
            });
        }
    }
}

const jwtManager = new JwtManager(JWT_SECRET);

export { jwtManager };