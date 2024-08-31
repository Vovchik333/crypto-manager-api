import { HttpCode, HttpError } from "@lib/services/http";
import { AssetService } from "./asset.service";
import { ErrorMessage } from "@enums";
import { NextFunction, Request, Response } from "express";
import { JwtRequest } from "@lib/services/jwt";

class AssetController {
    #assetService: AssetService;

    constructor(assetService: AssetService) {
        this.#assetService = assetService;
    }

    public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.query;

            if(userId === undefined || userId !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }

            const transaction = await this.#assetService.create(req.body);
        
            res.status(HttpCode.CREATED).send(transaction);
        } catch(err) {
            next(err);
        }
    }

    public getByFilter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId, ...filter } = req.query;
            const portfolioId = filter.portfolioId as string;

            if(userId === undefined || userId !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }

            const transactions = await this.#assetService.getByFilter({ portfolioId });
        
            res.send(transactions);
        } catch(err) {
            next(err);
        }
    }

    public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.query;

            if(userId === undefined || userId !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }

            const { id } = req.params as Record<'id', string>;
            const transaction = await this.#assetService.getById(id);
        
            res.send(transaction);
        } catch(err) {
            next(err);
        }
    }

    public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.query;

            if(userId === undefined || userId !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }

            const { id } = req.params as Record<'id', string>;
            const transaction = await this.#assetService.deleteById(id);
        
            res.send(transaction);
        } catch(err) {
            next(err);
        }
    }
}

export { AssetController };
