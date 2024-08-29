import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { ErrorMessage } from "@enums";
import { HttpCode, HttpError } from "@lib/services/http";
import { JwtRequest } from '@lib/services/jwt';

class TransactionController {
    #transactionService: TransactionService;

    constructor(transactionService: TransactionService) {
        this.#transactionService = transactionService;
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

            const transaction = await this.#transactionService.create(req.body);
        
            res.status(HttpCode.CREATED).send(transaction);
        } catch(err) {
            next(err);
        }
    }

    public getByFilter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId, ...filter } = req.query;
            const assetId = filter.assetId as string;

            if(userId === undefined || userId !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }

            const transactions = await this.#transactionService.getByFilter({ assetId });
        
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
            const transaction = await this.#transactionService.getById(id);
        
            res.send(transaction);
        } catch(err) {
            next(err);
        }
    }

    public updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { userId } = req.query;

            if(userId === undefined || userId !== (req as JwtRequest).token.id) {
                throw new HttpError({
                    status: HttpCode.UNAUTHORIZED, 
                    message: ErrorMessage.USER_ID_MISMATCH
                });
            }

            const { id } = req.params as Record<'id', string>;
            const transaction = await this.#transactionService.updateById(id, req.body);
        
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
            const transaction = await this.#transactionService.deleteById(id);
        
            res.send(transaction);
        } catch(err) {
            next(err);
        }
    }
}

export { TransactionController };
