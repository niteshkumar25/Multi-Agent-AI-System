import express from 'express'
import { aget } from '../controllers/agent.controller.js';

const router = express.Router();

router.post("/chat", aget)

export default router