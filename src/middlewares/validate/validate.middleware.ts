import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import HttpError from "../../helpers/error/http.error.js";
import { HttpCode } from "../../common/enums/http/http-code.enum.js";

const validate = (schema: ObjectSchema, isBody = true) => 
    (req: Request, res: Response, next: NextFunction) => {
        try {
            let isValidResult;

            if (isBody) {
                isValidResult = schema.validate(req.body);
            } else {
                isValidResult = schema.validate(req.params);
            }

            if(isValidResult.error) {
                throw new HttpError({
                    status: HttpCode.BAD_REQUEST, 
                    message: isValidResult.error.details[0].message
                });
            };

            next();
        } catch(err) {
            next(err);
        }
    }

export { validate };