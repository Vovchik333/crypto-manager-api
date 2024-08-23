import { Router } from "express";
import { ApiPath } from "@enums";
import { validate } from "@middlewares";
import { signInSchema, signUpSchema } from "@helpers";
import { authController } from "@controllers";

const router = Router();

router.post(
    ApiPath.SIGN_UP, 
    validate(signUpSchema, { isIdExists: false }),
    authController.signUp
);
router.post(
    ApiPath.SIGN_IN, 
    validate(signInSchema, { isIdExists: false }),
    authController.signIn
);

export { router as authRoutes };
