import express from "express";
import Section from "../models/sections.model.js";

const router = express.Router();

router.post("/add-section", async (req, res) => {
  try {
    const { name, displayOnHomePage } = req.body;

    if (!name) {
      return res.status(404).json({ message: "name is required" });
    }

    const existingSection = await Section.findOne({ name });

    if (existingSection) {
      return res.status(409).json({ message: "section alreay exist" });
    }

    const section = new Section({
      name,
      displayOnHomePage,
    });

    await section.save();

    return res
      .status(200)
      .json({ message: "section added successfully", data: section });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
});


router.get("/sections", async(req, res) => {
  
    try {
      const sections = await Section.find();

      return res.status(200).json({
        message: "Sections fetched successfully",
        data: sections,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
 
});

export default router;
