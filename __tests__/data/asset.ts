import { AssetRequestData } from "@types";
import { Types } from "mongoose";

const assetInput: AssetRequestData = {
    coin: (new Types.ObjectId()).toString(),
    portfolioId: (new Types.ObjectId()).toString()
};

const otherAssetInput = {
    coin: (new Types.ObjectId()).toString(),
    portfolioId: (new Types.ObjectId()).toString()
}

export { assetInput, otherAssetInput };
