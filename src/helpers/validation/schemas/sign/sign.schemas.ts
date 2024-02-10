import Joi from "joi";

const signUpSchema =  Joi.object({
    nickname: Joi.string().min(1).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required()
}).required();

const signInSchema =  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required()
}).required();

export {
    signUpSchema,
    signInSchema
};