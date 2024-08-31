import { Asset } from "./asset.type";

type AssetRequestData = Omit<Asset, 'id' | 'avgPrice' | 'invested' | 'holdings' | 'coin'> & {
    coin: string
};

export { type AssetRequestData };
