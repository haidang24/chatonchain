import express from 'express';
import protectRoute from "../middleware/protectRoute.js";
import {addFriend} from "../controllers/friends.controller.js";

const router = express.Router();

router.post('/addFriend/:friendId', protectRoute, addFriend);

export default router;
