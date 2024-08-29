import { NextFunction, Request, Response } from "express";
import { ErrorMessage } from "@enums";
import { HttpCode, HttpError } from "@lib/services/http";

const errorResponder = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        const { status, message } = err;
        res.status(status).send({ error: message });
        return;
    }

    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(ErrorMessage.INTERNAL_SERVER_ERROR);
}

export { errorResponder };
