import { NextFunction, Request, Response } from "express";
import { UserService } from "@services";
import { User, JwtRequest } from "@types";
import { HttpError } from "@helpers";
import { ErrorMessage, HttpCode } from "@enums";

class UserController {
    #userService: UserService;

    constructor(userService: UserService) {
        this.#userService = userService;
        this.getById = this.getById.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    public async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    public async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
