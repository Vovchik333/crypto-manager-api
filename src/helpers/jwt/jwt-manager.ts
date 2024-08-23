import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { HttpError } from "@helpers";
import { HttpCode } from "@enums";
import { JWT_SECRET } from "@config";

class JwtManager {
    #secret: Secret = JWT_SECRET;

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

export { JwtManager };