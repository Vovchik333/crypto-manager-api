import Joi from "joi";

const objectIdSchema = Joi.object({
    id: Joi.string().length(24).hex()
});

export { objectIdSchema };