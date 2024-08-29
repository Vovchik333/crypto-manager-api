import { Router } from "express";
import { ApiPath } from "../common/enums";
import { userRoute } from "@routes/user";
import { authRoute } from "@routes/auth";
import { transactionRoute } from "@routes/transaction";

const router = Router();

router.use(ApiPath.USERS, userRoute.router);
router.use(ApiPath.AUTH, authRoute.router);
router.use(ApiPath.TRANSACTIONS, transactionRoute.router);

export { router };