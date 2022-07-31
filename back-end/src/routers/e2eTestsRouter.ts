import { Router } from "express";
import e2eTestsController from "../controllers/e2eTestsController.js";

const e2eRouter = Router();

if(process.env.NODE_ENV === "test") {
    e2eRouter.post("/reset", e2eTestsController.deleteAll);
}

export default e2eRouter;