import { NextFunction, Request, Response } from "express";
import UserService from "../../services/user/user.service.js";
import { User } from "../../common/types/user/user.type.js";

class UserController {
    #userService: UserService;

    constructor(userService: UserService) {
        this.#userService = userService;
        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.#userService.create(req.body as User);

            res.send(user);
        } catch(err) {
            next(err);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as Record<'id', string>;
            const user = await this.#userService.getById(id);
        
            res.send(user);
        } catch(err) {
            next(err);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as Record<'id', string>;
            const user = await this.#userService.updateById(id, req.body as User);
        
            res.send(user);
        } catch(err) {
            next(err);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as Record<'id', string>;
            const user = await this.#userService.deleteById(id);
        
            res.send(user);
        } catch(err) {
            next(err);
        }
    }
}

export default UserController;