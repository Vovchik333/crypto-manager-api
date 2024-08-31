import { Asset } from "@types";
import { model, Schema, Types } from "mongoose";

const assetSchema = new Schema<Asset>({
    coin: {
        type: Types.ObjectId,
        required: true,
        ref: 'coin'
    },
    portfolioId: {
        type: String,
        required: true
    },
    invested: {
        type: Number,
        default: 0.0
    },
    holdings: {
        type: Number,
        default: 0.0
    }
});

const assetModel = model<Asset>('asset', assetSchema, 'assets');

export { assetModel };
