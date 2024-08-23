import { Model } from "mongoose";
import AbstractRepository from "../abstract/abstract.repository";
import { User } from "@types";

class UserRepository extends AbstractRepository<User> {
    constructor(model: Model<User>) {
        super(model);
    }

    public getByEmail(email: string): Promise<User | null> {
        return this.model.findOne({ email }).exec();
    }
}

export default UserRepository;
