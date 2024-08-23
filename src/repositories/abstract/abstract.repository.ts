import { Model, UpdateQuery } from "mongoose";

class AbstractRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    public getAll(): Promise<T[]> {
        return this.model.find({}).exec();
    }

    public getById(id: string): Promise<T | null> {
        return this.model.findById(id).exec();
    }

    public create(payload: T): Promise<T> {
        return this.model.create(payload);
    }

    public async updateById(id: string, payload: UpdateQuery<T>): Promise<T | null> {
        (payload as Record<'updatedAt', Date>).updatedAt = new Date();
        const options = {
            new: true
        }

        return await this.model.findByIdAndUpdate(id, { ...payload }, options).exec();
    }

    public deleteById(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }   

    public async deleteAll(): Promise<void> {
        await this.model.deleteMany({}).exec();
    }
}

export default AbstractRepository;