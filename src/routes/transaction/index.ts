import { transactionModel } from "./transaction.model";
import { TransactionRepository } from "./transaction.repository";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TransactionRoute } from "./transaction.route";
import { assetRepository } from "@routes/asset";

const transactionRepository = new TransactionRepository(transactionModel);
const transactionService = new TransactionService({
    transactionRepository,
    assetRepository
});
const transactionController = new TransactionController(transactionService);
const transactionRoute = new TransactionRoute(transactionController);

export { 
    transactionRepository, 
    transactionService, 
    transactionController, 
    transactionRoute 
};
export { 
    TransactionRepository, 
    TransactionService, 
    TransactionController, 
    TransactionRoute 
};
