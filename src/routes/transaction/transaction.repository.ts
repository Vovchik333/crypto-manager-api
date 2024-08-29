import { AbstractRepository } from "@lib/database";
import { type Transaction } from '@types';
import { Model } from "mongoose";

class TransactionRepository extends AbstractRepository<Transaction> {
    constructor(model: Model<Transaction>) {
        super(model);
    }
}

export { TransactionRepository };
