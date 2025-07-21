import { useRef, useState } from "react";
import { Icons } from "../icons";
import BlogContentPreview from "../blog/BlogContentPreview";
import compressImage from "../../utils/useImgCompression";
import api from "../../api";

interface Props {
  value: string;
  onChange: (content: string) => void;
  onImagesChange: (images: Record<string, string>) => void; // Changed to string URLs
  textIndent?: string;
  uploadedImages: Record<string, string>;
  setUploadedImages: (images: Record<string, string>) => void;
}

const RichTextEditor = ({
  value,
  onChange,
  onImagesChange,
  textIndent,
  uploadedImages,
  setUploadedImages,
}: Props) => {
  const [isVisible, setIsVisible] = useState<[boolean, boolean]>([true, false]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleVisible = (idx: number) => {
    setIsVisible([idx === 0, idx === 1]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && textareaRef.current) {
      setIsUploading(true);
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const filesArray = Array.from(e.target.files);

      try {
        // Step 1: Compress and prepare files for upload
        const formData = new FormData();
        const imageMetadata: Array<{ id: string; altText: string }> = [];

        for (const file of filesArray) {
          const imgId = `img-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;
          const altText = file.name.split(".")[0];

          // Compress image
          const compressedBase64 = await compressImage(file, 1200, 800, 0.85);
          const response = await fetch(compressedBase64);
          const blob = await response.blob();
          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
          });

          formData.append("images", compressedFile);
          imageMetadata.push({ id: imgId, altText });
        }

        // Step 2: Upload images to backend
        const uploadResponse = await api.post("/upload-images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        const { images: uploadedImageUrls } = uploadResponse.data;

        // Step 3: Create markdown snippets and update content
        const markdownSnippets: string[] = [];
        const newImagesPreview: Record<string, string> = {};
        const imageUrlMapping: Record<string, string> = {};

        uploadedImageUrls.forEach((imageData: any, index: number) => {
          const { id, altText } = imageMetadata[index];
          const imageUrl = imageData.url;

          newImagesPreview[id] = imageUrl;
          imageUrlMapping[id] = imageUrl;
          markdownSnippets.push(`![${altText}](${id})`); // Temporary placeholder
        });

        // Step 4: Update markdown content
        if (markdownSnippets.length > 0) {
          const before = value.substring(0, start);
          const after = value.substring(end);
          const newText = `${before}${markdownSnippets.join("\n")}${after}`;

          // Step 5: Replace placeholders with actual URLs
          let finalContent = newText;
          Object.entries(imageUrlMapping).forEach(([placeholder, url]) => {
            const regex = new RegExp(
              `!\\[([^\\]]*)\\]\\(${placeholder}\\)`,
              "g"
            );
            finalContent = finalContent.replace(regex, `![$1](${url})`);
          });

          onChange(finalContent);

          const updatedPreviewMap = { ...uploadedImages, ...newImagesPreview };
          setUploadedImages(updatedPreviewMap);
          onImagesChange(imageUrlMapping);

          setTimeout(() => {
            textarea.focus();
            const newCursorPosition =
              start + markdownSnippets.join("\n").length;
            textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
          }, 0);
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        // Handle error - maybe show a toast notification
      }

      setIsUploading(false);
      e.target.value = "";
    }
  };

  const triggerInputFile = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="border-2 border-gray-600 rounded-xl">
      <header className="flex items-center gap-10 border-b-2 border-gray-600 p-4">
        {["Write", "Preview"].map((label, i) => (
          <button key={i} type="button" onClick={() => handleVisible(i)}>
            <span
              className={`py-1 px-2 text-lg font-semibold cursor-pointer ${
                isVisible[i] ? "bg-gray-600 rounded-lg" : ""
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </header>
      <div className="w-full">
        {isVisible[0] ? (
          <>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Share your thoughts..."
              className={`${
                textIndent ? textIndent : ""
              } w-full text-lg outline-none p-4 h-64 snap-y bg-transparent resize-none`}
            />
            <div className="p-4 border-t-2 border-gray-600">
              <button
                type="button"
                onClick={triggerInputFile}
                disabled={isUploading}
                className="flex items-center gap-2 hover:text-purple-400 transition-colors disabled:opacity-50"
              >
                <Icons.Images />
                <span className="cursor-pointer">
                  {isUploading ? "Uploading images..." : "Attach images"}
                </span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
          </>
        ) : (
          <article className="w-full px-4 min-h-64 prose prose-slate dark:prose-invert max-w-none">
            <BlogContentPreview
              content={value}
              uploadedImages={uploadedImages}
            />
          </article>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
