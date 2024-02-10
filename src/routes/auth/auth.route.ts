import { Router } from "express";
import { ApiPath } from "../../common/enums/api/api-path.enum.js";
import { validate } from "../../middlewares/validate/validate.middleware.js";
import { signInSchema, signUpSchema } from "../../helpers/validation/schemas/sign/sign.schemas.js";
import { authController } from "../../controllers/controllers.js";

const router = Router();

router.post(
    ApiPath.SIGN_UP, 
    validate(signUpSchema),
    authController.signUp
);
router.post(
    ApiPath.SIGN_IN, 
    validate(signInSchema),
    authController.signIn
);

export { router as authRoutes };