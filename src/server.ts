import "dotenv/config";
import express, { Express } from "express";
import { router as routes } from './routes/routes.js';
import { connector } from "./data/database/database.js";
import { API_PORT } from "./config/config.js";
import { ApiPath } from "./common/enums/api/api-path.enum.js";
import { errorResponder } from "./middlewares/error/error-responder.middleware.js";

connector.connectToDB();

const app: Express = express();

app.use(express.json());
app.use(ApiPath.API, routes);
app.use(errorResponder);

app.listen(API_PORT, () => {
  console.log(`Server listening at http://localhost:${API_PORT}`);
});