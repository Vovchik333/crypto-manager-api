import { TransactionType } from "@enums";
import { AbstractRepository } from "@lib/database";
import { Asset, Transaction } from "@types";
import { Model } from "mongoose";

class AssetRepository extends AbstractRepository<Asset> {
    constructor(model: Model<Asset>) {
        super(model);
    }

    public async addTransaction(transaction: Transaction) {
        const { quantity, pricePerCoin } = transaction;

        const asset = await this.model
            .findByIdAndUpdate(
                transaction.assetId, 
                {
                    $inc: { 
                        holdings: quantity,
                        invested: quantity * pricePerCoin 
                    }
                }
            )
            .exec();

        return asset;
    }

    public async updateTransaction(prevTransaction: Transaction, curTransaction: Transaction) {
        const options = {
            new: true
        }
        const getInvested = (transaction: Transaction) => transaction.quantity * transaction.pricePerCoin;

        const asset = await this.model
            .findByIdAndUpdate(
                curTransaction.assetId, 
                {
                    $inc: { 
                        holdings: curTransaction.quantity - prevTransaction.quantity,
                        invested: getInvested(curTransaction) - getInvested(prevTransaction)
                    }
                },
                options
            )
            .exec();

        return asset;
    }

    public async removeTransaction(transaction: Transaction) {
        const { quantity, pricePerCoin } = transaction;

        const asset = await this.model
            .findByIdAndUpdate(
                transaction.assetId, 
                {
                    $inc: { 
                        holdings: -quantity,
                        invested: -(quantity * pricePerCoin) 
                    }
                }
            )
            .exec();

        return asset;
    }
}

export { AssetRepository };
