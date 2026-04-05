import { Router } from "express";
import { signUpUser , signInUser} from "../controllers/auth.controller.js";

const router = Router();

router.route("/signup").post(signUpUser);
router.route("/signin").post(signInUser);

export default router;
