import { Router } from 'express';
import {
  deleteUserHandler,
  getUserHandler,
  postUserHandler,
  putUserHandler,
} from './route-handlers.js';

export default router = Router();

router.get("/users/:userId", getUserHandler);
router.post("/users", postUserHandler);
router.put("/users/:userId", putUserHandler);
router.delete("/users/:userId", deleteUserHandler);
