import { TransactionType } from "@enums";
import { TransactionRequestData } from "@types";

const buyTransactionInput = {
    type: TransactionType.BUY,
    pricePerCoin: 10,
    quantity: 100
};

const sellTransactionInput = {
    type: TransactionType.SELL,
    pricePerCoin: 10,
    quantity: 100
};

const transactionUpdateInput: Partial<TransactionRequestData> = {
    pricePerCoin: 9,
    quantity: 90
}

const otherBuyTransactionInput = {
    type: TransactionType.BUY,
    pricePerCoin: 20,
    quantity: 500
}

export { buyTransactionInput, sellTransactionInput, otherBuyTransactionInput, transactionUpdateInput };
