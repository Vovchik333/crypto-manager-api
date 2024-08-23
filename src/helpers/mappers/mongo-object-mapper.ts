import { Document } from "mongoose";

const mongoObjectMapper = <T>(objectFromDb: T): T => {
    const { _id, __v, ...clearObject } = (objectFromDb as Document<T>).toObject();

    return {
        ...clearObject,
        id: _id
    };
}

export { mongoObjectMapper }
