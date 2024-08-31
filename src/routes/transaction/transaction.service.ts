import { TransactionRepository } from "./transaction.repository";
import { Transaction, TransactionRequestData } from "@types";
import { UpdateQuery } from "mongoose";
import { AssetRepository } from "@routes/asset";
import { TransactionType } from "@enums";
import { mapMongoObject } from "@lib/database";

type Constructor = {
    transactionRepository: TransactionRepository;
    assetRepository: AssetRepository;
}

class TransactionService {
    #transactionRepository: TransactionRepository;
    #assetRepository: AssetRepository;

    constructor({ transactionRepository, assetRepository }: Constructor) {
        this.#transactionRepository = transactionRepository;
        this.#assetRepository = assetRepository;
    }

    public async getByFilter(filter: Partial<Transaction>): Promise<Transaction[]> {
        const transactions = await this.#transactionRepository.getByFilter(filter);

        return transactions.map(mapMongoObject<Transaction>);
    }

    public async getById(id: string): Promise<Transaction> {
        const transaction = mapMongoObject<Transaction>(await this.#transactionRepository.getById(id));

        return transaction;
    }

    public async create (payload: TransactionRequestData): Promise<Transaction> {
        if (payload.type === TransactionType.SELL && payload.quantity > 0) {
            payload.quantity = -payload.quantity;
        }

        const transaction = mapMongoObject<Transaction>(await this.#transactionRepository.create(payload));
        await this.#assetRepository.addTransaction(transaction);

        return transaction;
    }

    public async updateById(id: string, payload: UpdateQuery<Transaction>): Promise<Transaction> {
        const prevTransaction = mapMongoObject<Transaction>(await this.#transactionRepository.getById(id));

        if (prevTransaction.type === TransactionType.SELL && payload.quantity > 0) {
            payload.quantity = -payload.quantity;
        }

        const transaction = mapMongoObject<Transaction>(await this.#transactionRepository.updateById(id, payload));
        await this.#assetRepository.updateTransaction(prevTransaction, transaction);

        return transaction;
    }

    public async deleteById(id: string): Promise<Transaction> {
        const transaction = mapMongoObject<Transaction>(await this.#transactionRepository.deleteById(id));
        await this.#assetRepository.removeTransaction(transaction);

        return transaction;
    }
}

export { TransactionService };
