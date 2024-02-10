import { userRoutes } from "./user/user.route.js";
import { ApiPath } from "../common/enums/api/api-path.enum.js";
import { Router } from "express";
import { authRoutes } from "./auth/auth.route.js";

const router = Router();

router.use(ApiPath.USERS, userRoutes);
router.use(ApiPath.AUTH, authRoutes);

export { router };