import { NextFunction, Request, Response } from "express";
import { HttpError } from "@helpers";
import { ErrorMessage, HttpCode } from "@enums";

const errorResponder = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        const { status, message } = err;
        res.status(status).send({ error: message });
        return;
    }

    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(ErrorMessage.INTERNAL_SERVER_ERROR);
}

export { errorResponder };