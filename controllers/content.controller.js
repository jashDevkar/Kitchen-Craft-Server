import Section from "../models/sections.model.js";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.config.js";
import Content from "../models/content.model.js";
import streamifier from "streamifier";
import { layoutFn } from "../utils/layout.js";

export const addContentController = async (req, res) => {
  try {
    const { sectionName } = req.body;

    if (!sectionName) {
      return res.status(400).json({
        success: false,
        message: "Section name is required",
      });
    }

    const section = await Section.findOne({
      name: sectionName,
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) reject(error);
        else resolve(result);
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    const content = await Content.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      section: section._id,
    });

    return res.status(200).json({
      success: true,
      message: "Uploaded successfully",
      data: content,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getAllContentController = async (req, res) => {
  try {
    const { sectionName, mode = "homepage" } = req.body;

    if (!sectionName) {
      return res
        .status(409)
        .json({ success: false, message: "invalid section name" });
    }

    const section = await Section.findOne({ name: sectionName });

    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "section does not exist" });
    }

    let query = { section: section._id };
    let selectFields = "-section -publicId -__v -updatedAt";

    if (mode === "homepage") {
      query.displayOnHomePage = true;
      selectFields = "-section -publicId -__v -updatedAt";
      const content = await Content.find(query)
        .select(selectFields)
        .limit(5)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Contents fetched successfully",
        data: content,
      });
    } else if (mode === "management") {
      selectFields = "-section -publicId -__v -updatedAt";
      const content = await Content.find(query)
        .select(selectFields)
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Contents fetched successfully",
        data: content,
      });
    } else if (mode === "viewall") {
      const content = await Content.find(query)
        .select("-publicId -__v")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Contents fetched successfully",
        data: content,
      });
    }

    return res.status(400).json({
      success: false,
      message: "invalid mode",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

export const toggleImageVisibilityController = async (req, res) => {
  try {
    const { contentId } = req.body;

    if (!contentId) {
      return res.status(400).json({
        success: false,
        message: "contentId is required",
      });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    content.displayOnHomePage = !content.displayOnHomePage;
    await content.save();

    return res.status(200).json({
      success: true,
      message: "Visibility toggled successfully",
      data: content,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

export const deleteContentController = async (req, res) => {
  return layoutFn(req, res, async () => {
    const { contentIds } = req.body;

    if (!contentIds || !Array.isArray(contentIds) || contentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content ids are required",
      });
    }

    const contents = await Content.find({
      _id: { $in: contentIds },
    });

    if (contents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No content found",
      });
    }

    await Promise.all(
      contents.map((content) => cloudinary.uploader.destroy(content.publicId)),
    );

    await Content.deleteMany({
      _id: { $in: contentIds },
    });

    return res.status(200).json({
      success: true,
      message: "Contents deleted successfully",
    });
  });
};
