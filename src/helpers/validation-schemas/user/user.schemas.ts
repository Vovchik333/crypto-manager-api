import Joi from "joi";
import { 
    MAX_PASSWORD_LENGTH, 
    MIN_PASSWORD_LENGTH, 
    MAX_NICKNAME_LENGTH, 
    MIN_NICKNAME_LENGTH
} from "@constants";

const updateUserSchema =  Joi.object({
    nickname: Joi.string().min(MIN_NICKNAME_LENGTH).max(MAX_NICKNAME_LENGTH).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH).optional()
}).required();

export {
    updateUserSchema
}
