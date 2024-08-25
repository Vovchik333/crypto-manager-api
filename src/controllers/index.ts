import { authService, transactionService, userService } from "../services";
import AuthController from "./auth/auth.controller";
import TransactionController from "./transaction/transaction.controller";
import UserController from "./user/user.controller";

const userController = new UserController(userService);
const authController = new AuthController(authService);
const transactionController = new TransactionController(transactionService);

export { 
    userController,
    authController,
    transactionController
};
