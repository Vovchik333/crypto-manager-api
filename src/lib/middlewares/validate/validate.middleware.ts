import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { objectIdSchema } from "@lib/database";
import { HttpCode, HttpError } from "@lib/services/http";

type ValidateOptions = { 
    isIdExists: boolean 
};

const validate = (
    schema: ObjectSchema | null = null, 
    options: ValidateOptions = { isIdExists: true }
) => 
    (req: Request, res: Response, next: NextFunction) => {
        try {
            if (options.isIdExists) {
                const isValidId = objectIdSchema.validate(req.body.id);

                if(isValidId.error) {
                    throw new HttpError({
                        status: HttpCode.BAD_REQUEST, 
                        message: isValidId.error.details[0].message
                    });
                };
            }

            if (schema !== null) {
                const isValidBody = schema.validate(req.body);

                if(isValidBody.error) {
                    throw new HttpError({
                        status: HttpCode.BAD_REQUEST, 
                        message: isValidBody.error.details[0].message
                    });
                }
            }

            next();
        } catch(err) {
            next(err);
        }
    }

export { validate };
