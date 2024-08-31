import { Router } from "express";
import { ApiPath } from "@enums";
import { AssetController } from "./asset.controller";
import { validate, authorization } from "@lib/middlewares";
import { createAssetSchema } from "./asset.schemas";

class AssetRoute {
    #assetController: AssetController;
    #router: Router;

    constructor(assetController: AssetController) {
        this.#router = Router();
        this.#assetController = assetController;

        this.#initRoutes();
    }

    public get router() {
        return this.#router;
    }

    #initRoutes(): void {
        this.#router.post(
            ApiPath.ROOT, 
            validate(createAssetSchema),
            authorization,
            this.#assetController.create
        );
        this.#router.get(
            ApiPath.ROOT, 
            validate(null, { isIdExists: false }),
            authorization,
            this.#assetController.getByFilter
        );
        this.#router.get(
            ApiPath.ID, 
            validate(),
            authorization,
            this.#assetController.getById
        );
        this.#router.delete(
            ApiPath.ID, 
            validate(),
            authorization,
            this.#assetController.deleteById
        );
    }
}

export { AssetRoute };