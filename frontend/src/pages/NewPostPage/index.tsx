import { useEffect, useState } from "react";
import { PostTitle, RichTextEditor, ThumbnailUpload } from "../../components";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { createPost } from "../../store/slices/postSlice";
import PostTags from "../../components/InputField/PostTags";

const NewPostPage = () => {
  const dispatch = useAppDispatch();
  const headerContent = ["New post"];
  const [isVisible, setIsVisible] = useState<boolean[]>(
    headerContent.map((_, idx) => idx === 0)
  );
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>(
    {}
  );
  const [uploadedImageUrls, setUploadedImageUrls] = useState<
    Record<string, string>
  >({});
  const { user } = useAppSelector((state) => state.auth);
  const { loading: isLoading, error } = useAppSelector((state) => state.posts);

  const handleVisible = (i: number) => {
    const newVisibility = Array(headerContent.length).fill(false);
    newVisibility[i] = true;
    setIsVisible(newVisibility);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setThumbnail(null);
    setTags([]);
    setUploadedImageUrls({});
    localStorage.removeItem("newPostData");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user._id) {
      console.error("User is not logged in or ID is missing.");
      return;
    }

    if (!title.trim()) {
      console.error("Title is required");
      return;
    }

    if (!content.trim()) {
      console.error("Content is required");
      return;
    }

    try {
      // Always create the post data object
      const postData = {
        title: title.trim(),
        content: content.trim(),
        tags,
        author: user._id,
        contentImages: Object.values(uploadedImageUrls),
        thumbnail, // Include the thumbnail file directly
      };

      // Dispatch the postData object - let the Redux thunk handle FormData creation
      await dispatch(createPost(postData)).unwrap();

      // Reset form on success
      resetForm();
    } catch (err: any) {
      console.error("Error creating post:", err);
      // Handle specific error cases if needed
      if (err.message) {
        console.error("Error message:", err.message);
      }
    }
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const saved = localStorage.getItem("newPostData");
        if (saved && saved !== "undefined" && saved !== "null") {
          const parsedData = JSON.parse(saved);
          if (parsedData && typeof parsedData === "object") {
            if (parsedData.title && typeof parsedData.title === "string") {
              setTitle(parsedData.title);
            }
            if (parsedData.content && typeof parsedData.content === "string") {
              setContent(parsedData.content);
            }
            if (parsedData.tags && Array.isArray(parsedData.tags)) {
              setTags(parsedData.tags);
            }
          }
        }
      } catch (error) {
        console.error("Error parsing saved post data:", error);
        localStorage.removeItem("newPostData");
      }
    };

    loadSavedData();
  }, []);

  // Save data to localStorage when title, content, or tags change
  useEffect(() => {
    if (title || content || tags.length > 0) {
      try {
        const dataToSave = {
          title,
          content,
          tags,
        };
        localStorage.setItem("newPostData", JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Error saving post data:", error);
      }
    }
  }, [title, content, tags]);

  return (
    <div className="text-gray-100 pl-60 pr-80 ">
      <div className="border-x-2 border-b-2 border-gray-600 flex flex-col">
        <header className="px-6 py-4 relative flex items-center gap-10">
          {headerContent.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => handleVisible(index)}
              className="relative text-center text-white text-lg font-semibold flex flex-col items-center cursor-pointer"
            >
              <span
                className={`w-full rounded-xl py-1 px-2 transition-colors duration-200 ${
                  isVisible[index]
                    ? "bg-gray-700 text-white"
                    : "bg-transparent text-gray-200"
                }`}
              >
                {label}
              </span>
              <span
                className={`absolute -bottom-4 w-20 border-b-2 border-white transition-opacity duration-200 ${
                  isVisible[index] ? "opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </header>

        <form
          onSubmit={handleFormSubmit}
          className="border-t-2 border-gray-600 px-6 py-6 flex flex-col gap-5"
        >
          <ThumbnailUpload thumbnail={thumbnail} onChange={setThumbnail} />
          <PostTitle value={title} onChange={setTitle} />
          <RichTextEditor
            value={content}
            onChange={setContent}
            onImagesChange={setUploadedImageUrls}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
          />
          <PostTags tags={tags} onChange={setTags} />

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md border border-red-500/30">
              <strong>Error:</strong>{" "}
              {typeof error === "string"
                ? error
                : "An error occurred while creating the post"}
            </div>
          )}

          <div className="flex gap-3 justify-between">
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="w-full border-none rounded-lg bg-purple-400 hover:bg-purple-500 px-4 py-2 text-lg text-gray-200 
              font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={isLoading}
              className="border border-gray-500 rounded-lg bg-transparent hover:bg-gray-700 px-4 py-2 text-lg text-gray-200 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostPage;
