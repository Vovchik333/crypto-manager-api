import { Router } from "express";
import { ApiPath } from "@enums";
import { validate } from "@lib/middlewares";
import { signInSchema, signUpSchema } from "./auth.schemas";
import { AuthController } from "./auth.controller";

class AuthRoute {
    #authController: AuthController;
    #router: Router;

    constructor(authController: AuthController) {
        this.#router = Router();
        this.#authController = authController;

        this.#initRoutes();
    }

    public get router() {
        return this.#router;
    }

    #initRoutes(): void {
        this.#router.post(
            ApiPath.SIGN_UP, 
            validate(signUpSchema, { isIdExists: false }),
            this.#authController.signUp
        );
        this.#router.post(
            ApiPath.SIGN_IN, 
            validate(signInSchema, { isIdExists: false }),
            this.#authController.signIn
        );
    }
}

export { AuthRoute };
