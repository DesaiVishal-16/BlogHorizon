import { useState } from "react";
import RichTextEditor from "../../RichTextEditor";
import { PrimaryButton } from "../../Buttons";
import defaultProfileImg from "../../../assets/user-profile-img.jpg";
import { Icons } from "../../icons";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  createComment,
  selectCreateCommentLoading,
} from "../../../store/slices/commentsSlice";

interface CommentFormProps {
  img: string | undefined;
  postId: string;
  isClick?: boolean;
  onToggle?: (value: boolean) => void;
  parentCommentId?: string;
}

const CommentForm = ({
  img,
  postId,
  isClick = false,
  onToggle,
  parentCommentId,
}: CommentFormProps) => {
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>(
    {}
  );
  const [commentVal, setCommentVal] = useState<string>("");
  const dispatch = useAppDispatch();
  const createLoading = useAppSelector(selectCreateCommentLoading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentVal.trim()) {
      return;
    }

    const commentData = {
      content: commentVal,
      postId,
      parentCommentId,
    };
    const result = await dispatch(createComment(commentData));
    if (createComment.fulfilled.match(result)) {
      setCommentVal("");
      setUploadedImages({});
      onToggle?.(false);
    }
  };

  const handleCancel = () => {
    setCommentVal("");
    setUploadedImages({});
    onToggle?.(false);
  };

  return (
    <div className="post-comment">
      {isClick ? (
        <div className="relative">
          <img
            src={img || defaultProfileImg}
            className="w-10 rounded-xl absolute top-18 left-5"
          />
          <form onSubmit={handleSubmit}>
            <RichTextEditor
              value={commentVal}
              onChange={setCommentVal}
              onImagesChange={setUploadedImages}
              textIndent="indent-18 leading-relaxed"
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
            />
            <PrimaryButton
              type="submit"
              name={createLoading ? "Commenting..." : "Comment"}
              disabled={createLoading || !commentVal.trim()}
              className="absolute right-4 bottom-2 bg-purple-500 rounded-xl px-4 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500"
            />
            <PrimaryButton
              type="button"
              onClick={handleCancel}
              disabled={createLoading}
              className="absolute top-4 right-4 bg-transparent hover:bg-transparent"
              icon={
                <Icons.Cancel className="hover:fill-red-500 text-2xl text-gray-400" />
              }
            />
          </form>
        </div>
      ) : (
        <div
          onClick={() => onToggle?.(true)}
          className="flex items-center cursor-pointer border border-gray-600 p-2 rounded-xl bg-gray-900 hover:border-gray-400"
        >
          <img src={img || defaultProfileImg} className="w-10 rounded-xl" />
          <span className="text-lg font-semibold text-gray-400 ml-4">
            Share your thoughts...
          </span>
          <PrimaryButton
            type="button"
            name="Post"
            className="bg-gray-800 rounded-xl px-4 hover:!bg-transparent hover:shadow-lg ml-auto"
          />
        </div>
      )}
    </div>
  );
};

export default CommentForm;
