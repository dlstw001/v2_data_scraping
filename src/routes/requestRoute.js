import express from "express";
import { requestController }  from "../controllers/index.js";

let router = express.Router();

router.post('/', requestController.createRequest);

export default router;