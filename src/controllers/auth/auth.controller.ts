import { NextFunction, Request, Response } from "express";
import AuthService from "../../services/auth/auth.service.js";

class AuthController {
    #authService: AuthService;

    constructor(authService: AuthService) {
        this.#authService = authService;
        this.signUp = this.signUp.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    public async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userWithToken = await this.#authService.signUp(req.body);

            res.send(userWithToken);
        } catch(err) {
            next(err);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userWithToken = await this.#authService.signIn(req.body);

            res.send(userWithToken);
        } catch(err) {
            next(err);
        }
    }
}

export default AuthController;