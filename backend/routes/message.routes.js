import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import { call } from "../controllers/call.controller.js";
// import  upload  from "../middleware/upload.js";
//TESTING
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
         cb( null, './uploads/' );
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

//
const router = express.Router();

router.get("/:id", protectRoute,getMessages);
router.post( "/send/:id", protectRoute, upload.single( 'file' ), sendMessage );
router.post( "/call/:id", protectRoute,)
// router.post("/send/:id", protectRoute,sendMessage);//TEST
export default router;
