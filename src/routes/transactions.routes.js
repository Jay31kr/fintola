import { Router } from "express";
import { createTransaction , deleteTransaction, getTransactions } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware..js";

const router = Router();

router.route("/create").post(verifyJWT , authorizeRoles("admin") , createTransaction);
router.route("/view").get(verifyJWT,getTransactions);
router.route("/:id").delete(verifyJWT , authorizeRoles("admin"), deleteTransaction)

export default router;