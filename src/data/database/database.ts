import { MONGO_DB_URL } from "../../config/config.js";
import Connector from "./connector/connector.js";

const connector = new Connector(MONGO_DB_URL);

export { connector };