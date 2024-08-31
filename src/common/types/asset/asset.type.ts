import { Coin } from "../coin/coin.type";

type Asset = {
    id: string;
    coin: Coin | string;
    portfolioId: string;
    invested: number;
    holdings: number;
};

export { type Asset };
