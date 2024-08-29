import app from "./app";
import { connector } from "./lib/database";

(async () => {
  await connector.connectToDB();
  app.start();
})();
