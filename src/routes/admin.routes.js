import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import { getUsers } from "../controllers/admin.controller.js";

const router = Router();

router.route("/").get(verifyJWT , authorizeRoles("admin"), getUsers);

export default router;