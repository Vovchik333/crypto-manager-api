import { Transaction } from "./transaction.type";

type TransactionRequestData = Omit<Transaction, 'id' | 'createdAt'>;

export { type TransactionRequestData };
