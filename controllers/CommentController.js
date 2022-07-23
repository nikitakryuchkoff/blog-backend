import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";

import { socket } from "../index.js";

export const getAllComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await CommentModel.find()
      .populate(["postId", "user"])
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить комментарии к статье",
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await CommentModel.find({ postId })
      .populate(["postId", "user"])
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить комментарии к статье",
    });
  }
};

export const create = async (req, res) => {
  try {
    const postId = req.params.postId;
    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { commentsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    ).populate("user");

    const doc = new CommentModel({
      text: req.body.text,
      postId,
      user: req.userId,
    });
    const comment = await doc.save();

    res.json(comment);
    socket.emit("SERVER:NEW_COMMENT_CREATE", comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать комментарий",
    });
  }
};
