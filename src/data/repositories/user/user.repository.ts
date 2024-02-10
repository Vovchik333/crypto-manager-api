import { Model } from "mongoose";
import { User } from "../../../common/types/user/user.type.js";
import AbstractRepository from "../abstract/abstract.repository.js";

class UserRepository extends AbstractRepository<User> {
    constructor(model: Model<User>) {
        super(model);
    }

    public getByEmail(email: string) {
        return this.model.findOne({ email }).exec();
    }
}

export default UserRepository;