import express from "express";
import Section from "../models/sections.model.js";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.config.js";
import Content from "../models/content.model.js";
import streamifier from "streamifier";
import { addSectionController, getAllSectionsController, deleteSectionsController,getAllHomePageSectionsController} from "../controllers/section.controller.js";
import { addContentController, getAllContentController, toggleImageVisibilityController,deleteContentController } from "../controllers/content.controller.js";

const router = express.Router();

router.post("/add-section", addSectionController);
router.get("/sections", getAllSectionsController);
router.post('/delete-sections',deleteSectionsController);
router.get("/homepage-sections",getAllHomePageSectionsController);


router.post("/add-content", upload.single("image"), addContentController);
router.post('/content',getAllContentController);
router.patch('/toggle-image-visibility', toggleImageVisibilityController);
router.delete('/delete-content',deleteContentController)



export default router;
