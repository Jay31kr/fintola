import { Router } from "express";
import { createTransaction } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware..js";

const router = Router();

router.route("/create").post(verifyJWT , authorizeRoles("admin") , createTransaction);

export default router;