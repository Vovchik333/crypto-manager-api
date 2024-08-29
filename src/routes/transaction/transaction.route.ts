import { Router } from "express";
import { ApiPath } from "@enums";
import { TransactionController } from "./transaction.controller";
import { validate, authorization } from "@lib/middlewares";
import { createTransactionSchema, updateTransactionSchema } from "./transaction.schemas";

class TransactionRoute {
    #transactionController: TransactionController;
    #router: Router;

    constructor(transactionController: TransactionController) {
        this.#router = Router();
        this.#transactionController = transactionController;

        this.#initRoutes();
    }

    public get router() {
        return this.#router;
    }

    #initRoutes(): void {
        this.#router.post(
            ApiPath.ROOT, 
            validate(createTransactionSchema),
            authorization,
            this.#transactionController.create
        );
        this.#router.get(
            ApiPath.ROOT, 
            validate(null, { isIdExists: false }),
            authorization,
            this.#transactionController.getByFilter
        );
        this.#router.get(
            ApiPath.ID, 
            validate(),
            authorization,
            this.#transactionController.getById
        );
        this.#router.put(
            ApiPath.ID, 
            validate(updateTransactionSchema),
            authorization,
            this.#transactionController.updateById
        );
        this.#router.delete(
            ApiPath.ID, 
            validate(),
            authorization,
            this.#transactionController.deleteById
        );
    }
}

export { TransactionRoute };
