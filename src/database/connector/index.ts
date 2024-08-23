import { MONGO_DB_URL } from "@config";
import Connector from "./connector";

const connector = new Connector(MONGO_DB_URL);

export { connector };