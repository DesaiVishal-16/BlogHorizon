import mongoose, { Schema } from "mongoose";

export interface CommentType extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  replies: mongoose.Types.ObjectId[];
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  isEdited: boolean;
  editedAt?: Date;
  createdAt?: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

const CommentSchema = new Schema<CommentType>(
  {
    content: { type: String, required: true, trim: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
    likes: { type: Number, default: 0, min: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ parentComment: 1 });

const Comment = mongoose.model<CommentType>("Comment", CommentSchema);
export default Comment;
