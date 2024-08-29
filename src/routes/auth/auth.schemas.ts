import Joi from "joi";
import { 
    MAX_PASSWORD_LENGTH, 
    MIN_PASSWORD_LENGTH, 
    MAX_NICKNAME_LENGTH, 
    MIN_NICKNAME_LENGTH
} from "@constants";

const signUpSchema =  Joi.object({
    nickname: Joi.string().min(MIN_NICKNAME_LENGTH).max(MAX_NICKNAME_LENGTH).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH).required()
}).required();

const signInSchema =  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH).required()
}).required();

export {
    signUpSchema,
    signInSchema
};
