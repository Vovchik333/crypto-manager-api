import express, { Express } from "express";
import cors from "cors";
import { API_PORT } from "@config";
import { ApiPath } from "@enums";
import { router as routes } from '@routes/index';
import { errorResponder } from "@lib/middlewares";

class App {
    #instance: Express;

    constructor() {
        this.#instance = express();

        this.#instance.use(cors());
        this.#instance.use(express.json());
        this.#instance.use(ApiPath.API, routes);
        this.#instance.use(errorResponder);
    }

    start() {
        this.#instance.listen(API_PORT, () => {
            console.log(`Server listening at http://localhost:${API_PORT}`);
        });
    }

    get instance() {
        return this.#instance;
    }
}

const app = new App();

export default app;
