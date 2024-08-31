import { assetModel } from "./asset.model";
import { AssetRepository } from "./asset.repository";
import { AssetService } from "./asset.service";
import { AssetController } from "./asset.controller";
import { AssetRoute } from "./asset.route";

const assetRepository = new AssetRepository(assetModel);
const assetService = new AssetService({
    assetRepository
});
const assetController = new AssetController(assetService);
const assetRoute = new AssetRoute(assetController);

export { 
    assetRepository, 
    assetService, 
    assetController, 
    assetRoute 
};
export { 
    AssetRepository, 
    AssetService, 
    AssetController, 
    AssetRoute 
};
