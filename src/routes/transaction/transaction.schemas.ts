import Joi from "joi";
import { MIN_PRICE_PER_COIN, MIN_QUANTITY, OBJECT_ID_LENGTH } from "@constants";
import { TransactionType } from "@enums";

const validTransactionTypes = Object.values(TransactionType);

const createTransactionSchema = Joi.object({
    assetId: Joi.string().length(OBJECT_ID_LENGTH).required(),
    type: Joi.string().valid(...validTransactionTypes).required(),
    pricePerCoin: Joi.number().min(MIN_PRICE_PER_COIN).max(Number.MAX_SAFE_INTEGER).required(),
    quantity: Joi.number().min(MIN_QUANTITY).max(Number.MAX_SAFE_INTEGER).optional()
}).required();

const updateTransactionSchema = Joi.object({
    assetId: Joi.string().length(OBJECT_ID_LENGTH).optional(),
    type: Joi.string().valid(...validTransactionTypes).optional(),
    pricePerCoin: Joi.number().min(MIN_PRICE_PER_COIN).max(Number.MAX_SAFE_INTEGER).optional(),
    quantity: Joi.number().min(MIN_QUANTITY).max(Number.MAX_SAFE_INTEGER).optional()
}).required();

export { createTransactionSchema, updateTransactionSchema };
