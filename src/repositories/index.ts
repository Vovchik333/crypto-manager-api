import AbstractRepository from "./abstract/abstract.repository";
import UserRepository from "./user/user.repository";
import TransactionRepository from "./transaction/transaction.repository";
import { userModel } from "../database/models/user/user.model";
import { transactionModel } from "database/models";

const userRepository = new UserRepository(userModel);
const transactionRepository = new TransactionRepository(transactionModel);

export { 
    userRepository,
    transactionRepository, 
    UserRepository, 
    TransactionRepository,
    AbstractRepository};
