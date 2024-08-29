import { NextFunction, Request, Response } from "express";
import { UserService } from "@routes/user";
import { User } from "@types";
import { ErrorMessage } from "@enums";
import { HttpCode, HttpError } from "@lib/services/http";
import { JwtRequest } from '@lib/services/jwt';

class UserController {
    #userService: UserService;

    constructor(userService: UserService) {
        this.#userService = userService;
    }

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as Record<'id', string>;

            if(id !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }
            
            const user = await this.#userService.getById(id);
        
            res.send(user);
        } catch(err) {
            next(err);
        }
    }

    public updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as Record<'id', string>;

            if(id !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }

            const user = await this.#userService.updateById(id, req.body as User);
        
            res.send(user);
        } catch(err) {
            next(err);
        }
    }

    public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as Record<'id', string>;

            if(id !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }

            const user = await this.#userService.deleteById(id);
        
            res.send(user);
        } catch(err) {
            next(err);
        }
    }
}

export default UserController;
