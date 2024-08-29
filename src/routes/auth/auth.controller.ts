import { NextFunction, Request, Response } from "express";
import { AuthService } from "@routes/auth";
import { HttpCode } from "@lib/services/http";

class AuthController {
    #authService: AuthService;

    constructor(authService: AuthService) {
        this.#authService = authService;
    }

    public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userWithToken = await this.#authService.signUp(req.body);

            res.status(HttpCode.CREATED).send(userWithToken);
        } catch(err) {
            next(err);
        }
    }

    public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userWithToken = await this.#authService.signIn(req.body);

            res.send(userWithToken);
        } catch(err) {
            next(err);
        }
    }
}

export { AuthController };
