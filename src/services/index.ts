import { transactionRepository, userRepository } from "../repositories";
import AuthService from "./auth/auth.service";
import TransactionService from "./transaction/transaction.service";
import UserService from "./user/user.service";

const userService = new UserService(userRepository);
const authService = new AuthService(userRepository);
const transactionService = new TransactionService(transactionRepository);

export { 
    userService,
    authService,
    transactionService,
    AuthService,
    UserService,
    TransactionService
 };