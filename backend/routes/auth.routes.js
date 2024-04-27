import express from "express";
import { login, logout, signup ,login_domain} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post( "/login_domain", login_domain );

// router.post( "/callback", callback );
// router.post("/callbackserver", logout);

router.post("/logout", logout);

export default router;
