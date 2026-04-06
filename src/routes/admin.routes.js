import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/roleAuth.middleware.js";
import { getUsers , getPendingAdminRequests , handleAdminRequest} from "../controllers/admin.controller.js";

const router = Router();

router.route("/").get(verifyJWT , authorizeRoles("admin"), getUsers);
router.route("/requests").get(verifyJWT , authorizeRoles("admin") , getPendingAdminRequests);
router.route("/requests/:id").patch(verifyJWT , authorizeRoles("admin") , handleAdminRequest);

export default router;