import Section from "../models/sections.model.js";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.config.js";
import Content from "../models/content.model.js";
import streamifier from "streamifier";

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
        const { sectionName } = req.body;

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

        const content = await Content.find({
            section: section._id,
        }).select("-_id -section -publicId -__v -updatedAt");


        return res
            .status(200)
            .json({
                success: true,
                message: "Contents fetched succesfully",
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
