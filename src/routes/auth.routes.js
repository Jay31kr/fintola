import { Router } from "express";
import { signUpUser , signInUser  , signOutUser , getMe} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js" 

const router = Router();

router.route("/signup").post(signUpUser);
router.route("/signin").post(signInUser);
router.route("/signout").post(verifyJWT , signOutUser);
router.route("/me").get(verifyJWT , getMe);

export default router;
