import { MONGO_DB_URL } from "@config";
import { Connector } from "./connector";
import { AbstractRepository } from "./abstract.repository";

const connector = new Connector(MONGO_DB_URL);

export { connector };
export { AbstractRepository };
export { OBJECT_ID_LENGTH } from './constants';
export { objectIdSchema } from './schemas';
export { mapMongoObject } from './helpers';
