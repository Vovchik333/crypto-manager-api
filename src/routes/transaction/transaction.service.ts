import { ErrorMessage } from "@enums";
import { mapMongoObject } from "@lib/database";
import { TransactionRepository } from "./transaction.repository";
import { Transaction, TransactionRequestData } from "@types";
import { UpdateQuery } from "mongoose";
import { HttpCode, HttpError } from "@lib/services/http";

class TransactionService {
    #transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.#transactionRepository = transactionRepository;
    }

    public async create (payload: TransactionRequestData): Promise<Transaction> {
        const transactionFromDb = await this.#transactionRepository.create(payload);
        const transaction = mapMongoObject<Transaction>(transactionFromDb);

        return transaction;
    }

    public async getByFilter(filter: Partial<Transaction>): Promise<Transaction[]> {
        const transactionsFromDb = await this.#transactionRepository.getByFilter(filter);
        const transactions = transactionsFromDb.map(mapMongoObject<Transaction>);

        return transactions;
    }

    public async getById(id: string): Promise<Transaction> {
        const transactionFromDb = await this.#transactionRepository.getById(id);

        if (transactionFromDb === null) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: ErrorMessage.NOT_FOUND
            });
        }

        const transaction = mapMongoObject<Transaction>(transactionFromDb);

        return transaction;
    }

    public async updateById(id: string, payload: UpdateQuery<Transaction>): Promise<Transaction> {
        const transactionFromDb = await this.#transactionRepository.updateById(id, payload);

        if (transactionFromDb === null) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: ErrorMessage.NOT_FOUND
            });
        }

        const transaction = mapMongoObject<Transaction>(transactionFromDb);

        return transaction;
    }

    public async deleteById(id: string): Promise<Transaction> {
        const transactionFromDb = await this.#transactionRepository.deleteById(id);

        if (transactionFromDb === null) {
            throw new HttpError({
                status: HttpCode.NOT_FOUND,
                message: ErrorMessage.NOT_FOUND
            });
        }

        const transaction = mapMongoObject<Transaction>(transactionFromDb);

        return transaction;
    }
}

export { TransactionService };
