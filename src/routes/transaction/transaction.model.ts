import { Schema, model } from "mongoose";
import { type Transaction } from "@types";

const transactionSchema = new Schema<Transaction>({
    assetId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    pricePerCoin: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const transactionModel = model<Transaction>('transaction', transactionSchema, 'transactions');

export { transactionModel };
