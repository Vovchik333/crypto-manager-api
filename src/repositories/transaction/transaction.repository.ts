import { AbstractRepository } from "@repositories";
import { type Transaction } from '@types';
import { Model } from "mongoose";

class TransactionRepository extends AbstractRepository<Transaction> {
    constructor(model: Model<Transaction>) {
        super(model);
    }
}

export default TransactionRepository;
