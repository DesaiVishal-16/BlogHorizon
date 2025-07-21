
const extractImagesFromMarkdown = (markdownContent: string) => {
  const imageRegex = /!\[([^\]]*)\]\((image\/[a-zA-Z]+;base64,[^)]+)(?:\s+"([^"]*)")?\)/g;
    const images: Array<{
        fullMatch: string;
        alt: string;
        src: string;
        title?: string;
        index: number;
    }> = [];

    let match: RegExpExecArray | null;
    let index = 0;
    while((match = imageRegex.exec(markdownContent)) !== null){
         images.push({
            fullMatch: match[0],
            alt: match[1] || '',
            src: match[2],
            title: match[3],
            index: index++,
         });
    }
    return images;
};
export default extractImagesFromMarkdown;