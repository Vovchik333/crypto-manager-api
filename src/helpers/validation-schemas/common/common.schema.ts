import Joi from "joi";

const OBJECT_ID_LENGTH = 24;

const objectIdSchema = Joi.object({
    id: Joi.string().length(OBJECT_ID_LENGTH).hex()
});

export { objectIdSchema };
