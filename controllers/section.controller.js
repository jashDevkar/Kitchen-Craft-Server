import Section from "../models/sections.model.js";
import { layoutFn } from "../utils/layout.js";

export const addSectionController = async (req, res) => {
  try {
    const { name, displayOnHomePage } = req.body;

    if (!name) {
      return res
        .status(404)
        .json({ success: false, message: "name is required" });
    }

    const existingSection = await Section.findOne({ name });

    if (existingSection) {
      return res
        .status(409)
        .json({ success: false, message: "section alreay exist" });
    }

    const section = new Section({
      name,
      displayOnHomePage,
    });

    await section.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "section added successfully",
        data: section,
      });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "internal server error",
        error: err.message,
      });
  }
};

export const getAllSectionsController = async (req, res) => {
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
};

export const getAllHomePageSectionsController = async (req, res) => {
  return layoutFn(req, res, async () => {
    const sections = await Section.find({ displayOnHomePage: true });

    return res
      .status(200)
      .json({
        success: true,
        message: "successfully fetched all home-page sections",
        data: sections,
      });
  });
};

export const deleteSectionsController = async (req, res) => {
  try {
    const { ids } = req.body;

    // Validate ids
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ids array is required",
      });
    }

    // Delete sections
    const deletedSections = await Section.deleteMany({
      _id: { $in: ids },
    });

    return res.status(200).json({
      success: true,
      message: "Sections deleted successfully",
      deletedCount: deletedSections.deletedCount,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
