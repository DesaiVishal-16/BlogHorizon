import { PostType } from "../models/Post";
import cloudinary from "./cloudinary";
import extractImagesFromMarkdown from "./extractImagesFromMarkdown";
import uploadImageToCloudinary from "./uploadImageToCloudinary";


const processMarkdownImages = async (markdownContent: string):Promise<{
   processedContent: string;
   uploadedImages: Array<{
       id: number;
       url: string;
       publicId: string;
       alt: string;
       title?: string;
       width: number;
       height: number; 
   }>; 
}> => {
  const images = extractImagesFromMarkdown(markdownContent);
  const uploadedImages: any[] = [];
  const imagesToCleanup: string[] = [];
  let processedContent = markdownContent;

  try{
    for(let i = 0; i < images.length; i++){
        const image = images[i];
        let uploadResult;

        if(image.src.startsWith('data:image/')){
           uploadResult = await uploadImageToCloudinary(image.src,i);
           imagesToCleanup.push(uploadResult.publicId);
        }else if(image.src.startsWith('blog:')){
             throw new Error('Blog URLs cannot be processed server-side')
        }else continue;
    
    const imageInfo = {
      id: i + 1,
      url : uploadResult.url,
      publicId: uploadResult.publicId,
      alt: image.alt,
      title: image.title,
      width: uploadResult.width,
      height: uploadResult.height,
    }
    uploadedImages.push(imageInfo);
    processedContent = processedContent.replace(image.fullMatch,`[image:${imageInfo.id}]`)
  }
    return {
      processedContent,uploadedImages
    }
  }catch(err){
     for(const publicId of imagesToCleanup){
      try{
        await cloudinary.uploader.destroy(publicId);
        console.log(`Cleaned up image: ${publicId}`);
      }catch(cleanupErr){
        console.error(`Error cleaning up image ${publicId}:`, cleanupErr);
      }
     }
     throw err; 
  }
}

const prepareMarkdownForFrontend = (post: PostType) => {
  let content = post.content;
  
  if (post.contentImages && post.contentImages.length > 0) {
    post.contentImages.forEach((image: any) => {
      const placeholder = `[image:${image.id}]`;
      const markdownImage = `![${image.alt}](${image.url}${image.title ? ` "${image.title}"` : ''})`;
      content = content.replace(placeholder, markdownImage);
    });
  }
  
  return content;
};

export {processMarkdownImages, prepareMarkdownForFrontend};