import express from "express";
import router from "./routers/router.js";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

const port = 8000;
app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  return res.status(200).json({ status: "healthy" });
});

mongoose.connect("mongodb://localhost:27017/kitchen-craft").then(() => {
  console.log("Connected to mongoose");
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
