import { ApiPath } from "../../common/enums/api/api-path.enum.js";
import { Router } from "express";
import { userController } from "../../controllers/controllers.js";
import { authorization } from "../../middlewares/auth/auth.middleware.js";
import { validate } from "../../middlewares/validate/validate.middleware.js";
import { objectIdSchema } from "../../helpers/validation/schemas/common/common.schema.js";

const router = Router();

router.get(
    ApiPath.ID, 
    validate(objectIdSchema, false),
    authorization,
    userController.getById
);
router.put(
    ApiPath.ID, 
    validate(objectIdSchema),
    authorization,
    userController.updateById
);
router.delete(
    ApiPath.ID, 
    validate(objectIdSchema, false),
    authorization,
    userController.deleteById
);

export { router as userRoutes };