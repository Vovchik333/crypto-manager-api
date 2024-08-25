import { Router } from "express";
import { ApiPath } from "../common/enums";
import { userRoutes } from "./user/user.route";
import { authRoutes } from "./auth/auth.route";
import { transactionRoutes } from "./transaction/transaction.route";

const router = Router();

router.use(ApiPath.USERS, userRoutes);
router.use(ApiPath.AUTH, authRoutes);
router.use(ApiPath.TRANSACTIONS, transactionRoutes);

export { router };