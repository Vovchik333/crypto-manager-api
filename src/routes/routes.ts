import { router as userRoutes } from "./user/user.route.js";
import { ApiPath } from "../common/enums/api/api-path.enum.js";
import { Router } from "express";

const router = Router();

router.use(ApiPath.USERS, userRoutes);

export { router };