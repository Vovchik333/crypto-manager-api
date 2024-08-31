import { ErrorMessage } from "@enums";
import { HttpCode, HttpError } from "@lib/services/http";
import { Document } from "mongoose";

const mapMongoObject = <T>(objectFromDb: T | null): T => {
    if (objectFromDb === null) {
        throw new HttpError({
            status: HttpCode.NOT_FOUND,
            message: ErrorMessage.NOT_FOUND
        });
    }

    const { _id, __v, ...clearObject } = (objectFromDb as Document<T>).toObject();

    return {
        ...clearObject,
        id: _id
    };
}

export { mapMongoObject }
