import { NextFunction, Request, Response } from "express";
import { ErrorMessage} from "@enums";
import { HttpHeader, HttpCode, HttpError } from "@lib/services/http";
import { jwtService,JwtRequest } from "@lib/services/jwt";

const authorization = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers[HttpHeader.AUTHORIZATION];

        if(!token) {
            throw new HttpError({ 
                status: HttpCode.UNAUTHORIZED, 
                message: ErrorMessage.NOT_AUTHORIZED
            });
        }

        const decoded = jwtService.verifyJwt(token.replace('Bearer ', ''));
        (req as JwtRequest).token = decoded as { id: string };

        next();
    } catch(err) {
        next(err);
    }
}

export { authorization };
