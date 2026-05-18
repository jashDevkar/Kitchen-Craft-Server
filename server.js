import express from "express";
import router from "./routers/router.js";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const app = express();

const port = process.env.PORT || 8001;

const mongodb_uri =  `mongodb+srv://devkarjash:${process.env.MONGODB_URI_PASSWORD}@cluster0.tganp.mongodb.net/?appName=Cluster0`
app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  return res.status(200).json({ status: "healthy" });
});

mongoose.connect(mongodb_uri).then(() => {
  console.log("Connected to mongoose");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
