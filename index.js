import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import createSocket from "./socket/socket.js";
import { createServer } from "http";

import {
  registerValidation,
  postCreateValidation,
  loginValidation,
  commentCreateValidation,
} from "./validations/index.js";
import {
  UserController,
  PostController,
  CommentController,
} from "./controllers/index.js";
import { handleErrors, checkAuth } from "./utils/index.js";

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.zwcrnmx.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((error) => console.log(error));

const app = express();
const server = createServer(app);
export const socket = createSocket(server);

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
app.post(
  "/auth/register",
  registerValidation,
  handleErrors,
  UserController.register
);
app.post(
  "/auth/register",
  registerValidation,
  handleErrors,
  UserController.register
);
app.post("/auth/login", loginValidation, handleErrors, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);
app.get("/posts/tags", PostController.getTags);
app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleErrors,
  PostController.update
);
app.post(
  "/comments/:postId",
  checkAuth,
  commentCreateValidation,
  handleErrors,
  CommentController.create
);

app.get(
  "/comments/:postId",
  checkAuth,
  handleErrors,
  CommentController.getPostComments
);
app.get("/comments", checkAuth, handleErrors, CommentController.getAllComments);
app.use("/uploads", express.static("uploads"));

server.listen(4444, (error) => {
  if (error) {
    return console.log(error);
  }

  console.log("Server is running on port 4444");
});
