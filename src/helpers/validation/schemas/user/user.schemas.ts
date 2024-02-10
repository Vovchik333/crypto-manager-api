import Joi from "joi";

const updateUserSchema =  Joi.object({
    nickname: Joi.string().min(1).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(3).max(30).optional()
}).required();

export {
    updateUserSchema
}
