import { Router } from "express";
import { getAll } from "../controller/userContoller";
import { login, me, protect, signup } from "../controller/authController";

const router: Router = Router();

router.get("/alluser", getAll);

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, me);

export default router;
