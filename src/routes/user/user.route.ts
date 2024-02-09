import { ApiPath } from "../../common/enums/api/api-path.enum.js";
import { Router } from "express";
import { userController } from "../../controllers/controllers.js";

const router = Router();

router.get(
    ApiPath.ID, 
    userController.getById
);
router.post(
    ApiPath.ROOT, 
    userController.create
);
router.put(
    ApiPath.ID, 
    userController.updateById
);
router.delete(
    ApiPath.ID, 
    userController.deleteById
);

export { router };