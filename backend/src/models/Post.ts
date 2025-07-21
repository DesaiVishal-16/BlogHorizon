import mongoose, { Document, Schema } from "mongoose";

export interface PostType extends Document {
  _id: string;
  thumbnail?: string;
  thumbnailPublicId?: string;
  title: string;
  content: string;
  contentImages?: Array<{
    url: string;
    publicId: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  likes:number;
  likedBy : mongoose.Types.ObjectId[];
  commentCount: number;
}


const PostSchema = new Schema<PostType>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    thumbnail: { type: String, default: null },
    thumbnailPublicId: { type: String, default: null },
    tags: { type: [String], default: [] },
    contentImages: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
          alt: { type: String, default: "" },
          width: { type: Number },
          height: { type: Number },
        },
      ],
      default: [],
    },
    likes: {type:Number,default:0,min:0},
    likedBy: [{type: mongoose.Schema.Types.ObjectId,ref:'User', default:[]}],
    commentCount: {type: Number, default: 0, min: 0}
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model<PostType>("Post", PostSchema);
export default Post;
