import { Router } from "express";
import { ApiPath } from "@enums";
import { userController } from "@controllers";
import { validate, authorization } from "@middlewares";
import { updateUserSchema } from "@helpers";

const router = Router();

router.get(
    ApiPath.ID, 
    validate(),
    authorization,
    userController.getById
);
router.put(
    ApiPath.ID, 
    validate(updateUserSchema),
    authorization,
    userController.updateById
);
router.delete(
    ApiPath.ID, 
    validate(),
    authorization,
    userController.deleteById
);

export { router as userRoutes };
