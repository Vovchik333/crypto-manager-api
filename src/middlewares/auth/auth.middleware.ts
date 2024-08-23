import { NextFunction, Request, Response } from "express";
import { HttpError, jwtManager } from "@helpers";
import { JwtRequest } from "@types";
import { ErrorMessage, HttpCode, HttpHeader } from "@enums";

const authorization = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers[HttpHeader.AUTHORIZATION];

        if(!token) {
            throw new HttpError({ 
                status: HttpCode.UNAUTHORIZED, 
                message: ErrorMessage.NOT_AUTHORIZED
            });
        }

        const decoded = jwtManager.verifyJwt(token.replace('Bearer ', ''));
        (req as JwtRequest).token = decoded as { id: string };

        next();
    } catch(err) {
        next(err);
    }
}

export { authorization };