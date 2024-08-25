import { Router } from "express";
import { ApiPath } from "@enums";
import { transactionController } from "@controllers";
import { validate, authorization } from "@middlewares";
import { createTransactionSchema, updateTransactionSchema } from "@helpers";

const transactionRoutes = Router();

transactionRoutes.post(
    ApiPath.ROOT, 
    validate(createTransactionSchema),
    authorization,
    transactionController.create
);
transactionRoutes.get(
    ApiPath.ROOT, 
    validate(null, { isIdExists: false }),
    authorization,
    transactionController.getByFilter
);
transactionRoutes.get(
    ApiPath.ID, 
    validate(),
    authorization,
    transactionController.getById
);
transactionRoutes.put(
    ApiPath.ID, 
    validate(updateTransactionSchema),
    authorization,
    transactionController.updateById
);
transactionRoutes.delete(
    ApiPath.ID, 
    validate(),
    authorization,
    transactionController.deleteById
);

export { transactionRoutes };
