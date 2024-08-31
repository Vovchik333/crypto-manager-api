import { Model } from "mongoose";
import { AbstractRepository } from "@lib/database";
import { User } from "@types";

class UserRepository extends AbstractRepository<User> {
    constructor(model: Model<User>) {
        super(model);
    }

    public async getByEmail(email: string): Promise<User | null> {
        const user = await this.model.findOne({ email }).exec();

        return user;
    }
}

export default UserRepository;
