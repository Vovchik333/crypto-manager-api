import { OBJECT_ID_LENGTH } from "@constants";
import Joi from "joi";

const createAssetSchema = Joi.object({
    coin: Joi.string(),
    portfolioId: Joi.string().length(OBJECT_ID_LENGTH).required()
}).required();

export { createAssetSchema };
