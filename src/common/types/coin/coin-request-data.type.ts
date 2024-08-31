import { Coin } from "./coin.type";

type CoinRequestData = Omit<Coin, 'id'>;

export { type CoinRequestData };
