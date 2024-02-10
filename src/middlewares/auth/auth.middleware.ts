import { NextFunction, Request, Response } from "express";
import HttpError from "../../helpers/error/http.error.js";
import { HttpCode } from "../../common/enums/http/http-code.enum.js";
import { jwtManager } from "../../helpers/jwt/jwt-manager.js";
import { JwtRequest } from "../../common/types/jwt/jwt-request.type.js";

const authorization = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers[`authorization`];

        if(!token) {
            throw new HttpError({ 
                status: HttpCode.UNAUTHORIZED, 
                message: 'Not Authorized' 
            });
        }

        const decoded = jwtManager.verifyJwt(token.replace('Bearer ', ''));
        (req as JwtRequest).token = decoded as { id: string, email: string };

        next();
    } catch(err) {
        next(err);
    }
}

export { authorization };