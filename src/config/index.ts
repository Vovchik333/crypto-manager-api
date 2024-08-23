import "dotenv/config";

export const API_PORT = parseInt(process.env.API_PORT!);

export const MONGO_DB_URL = process.env.MONGO_DB_URL!;

export const JWT_SECRET = process.env.JWT_SECRET!;

export const CRYPTO_SALT_ROUNDS = parseInt(process.env.CRYPTO_SALT_ROUNDS!);
