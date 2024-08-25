import { TransactionType } from "@enums";
import { TransactionRequestData } from "@types";
import mongoose from "mongoose";

const transactionInput: TransactionRequestData = {
    assetId: (new mongoose.Types.ObjectId()).toString(),
    type: TransactionType.BUY,
    pricePerCoin: 10,
    quantity: 100
};

const transactionUpdateInput: Partial<TransactionRequestData> = {
    pricePerCoin: 9,
    quantity: 90
}

const otherTransactionInput: TransactionRequestData = {
    assetId: (new mongoose.Types.ObjectId()).toString(),
    type: TransactionType.BUY,
    pricePerCoin: 20,
    quantity: 500
}

export { transactionInput, otherTransactionInput, transactionUpdateInput };
