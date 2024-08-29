import { Router } from "express";
import { ApiPath } from "@enums";
import { UserController } from "@routes/user";
import { validate, authorization } from "@lib/middlewares";
import { updateUserSchema } from "./user.schemas";

class UserRoute {
    #userController: UserController;
    #router: Router;

    constructor(userController: UserController) {
        this.#router = Router();
        this.#userController = userController;

        this.#initRoutes();
    }

    public get router() {
        return this.#router;
    }

    #initRoutes(): void {
        this.#router.get(
            ApiPath.ID, 
            validate(),
            authorization,
            this.#userController.getById
        );
        this.#router.put(
            ApiPath.ID, 
            validate(updateUserSchema),
            authorization,
            this.#userController.updateById
        );
        this.#router.delete(
            ApiPath.ID, 
            validate(),
            authorization,
            this.#userController.deleteById
        );
    }
}

export { UserRoute };
