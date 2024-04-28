import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { call } from "../controllers/call.controller.js";
import multer from "multer";
import bodyParser from "body-parser";

// import  upload  from "../middleware/upload.js";
//TESTING
// configure storage
const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '');
    }
} );
const upload = multer({ storage }).single('file');
//
const router = express.Router();

router.get("/:id", protectRoute,getMessages);
router.post( "/send/:id", protectRoute, upload, sendMessage );
router.post( "/call/:id", protectRoute,)
// router.post("/send/:id", protectRoute,sendMessage);//TEST
export default router;
