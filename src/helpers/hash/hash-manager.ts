import { compareSync, hash } from "bcrypt";
import { CRYPTO_SALT_ROUNDS } from "@config";

class HashManager {
    #saltRounds = CRYPTO_SALT_ROUNDS;

    public async hashData(data: string): Promise<string> {
        return await hash(data, this.#saltRounds);
    }

    public compare(data: string, encryptedData: string): boolean {
        return compareSync(data, encryptedData);
    }
}

export default HashManager;
