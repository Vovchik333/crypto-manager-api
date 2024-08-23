import app from "./app";
import { connector } from "@database";

(async () => {
  await connector.connectToDB();
  app.start();
})();
