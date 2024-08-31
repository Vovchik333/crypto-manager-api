import { Asset, AssetRequestData } from "@types";
import { AssetRepository } from "./asset.repository";
import { mapMongoObject } from "@lib/database";

type Constructor ={
    assetRepository: AssetRepository;
};

class AssetService {
    #assetRepository: AssetRepository;

    constructor({ assetRepository }: Constructor) {
        this.#assetRepository = assetRepository;
    }

    public async getByFilter(filter: Partial<Asset>): Promise<Asset[]> {
        const assets = await this.#assetRepository.getByFilter(filter);

        return assets.map(mapMongoObject<Asset>);
    }

    public async getById(id: string): Promise<Asset> {
        const asset = mapMongoObject<Asset>(await this.#assetRepository.getById(id));

        return asset;
    }

    public async create(payload: AssetRequestData): Promise<Asset> {
        const asset = mapMongoObject<Asset>(await this.#assetRepository.create(payload as Asset));

        return asset;
    }

    public async deleteById(id: string): Promise<Asset> {
        const asset = mapMongoObject<Asset>(await this.#assetRepository.deleteById(id));

        return asset;
    }
}

export { AssetService };
