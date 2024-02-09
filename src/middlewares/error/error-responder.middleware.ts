import { NextFunction, Request, Response } from "express";
import { HttpCode } from "../../common/enums/http/http-code.enum.js";
import HttpError from "../../helpers/error/http.error.js";

const errorResponder = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        const { status, message } = err;
        res.status(status).send({ error: message });
        return;
    }

    res.status(HttpCode.INTERNAL_SERVER_ERROR).send('Internal Server Error.');
}

export { errorResponder };