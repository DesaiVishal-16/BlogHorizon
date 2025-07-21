import { useEffect, useRef, useState } from "react";
import { Icons } from "../icons";

interface Props{
  thumbnail: File | null;
  onChange : (file: File | null) => void;
};

const ThumbnailUpload = ({thumbnail,onChange}:Props) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl,setPreviewUrl] = useState<string | null>(null); 
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file){
        onChange(file);
      } 
    };
    const handleDeleteImg = (e: React.MouseEvent) => {
      e.stopPropagation();
       onChange(null); 
    };
    useEffect(()=>{
      if(thumbnail){
        const objectUrl = URL.createObjectURL(thumbnail);
        setPreviewUrl(objectUrl);
        return ()=> URL.revokeObjectURL(objectUrl);
      }else{
        setPreviewUrl(null);
      }
    },[thumbnail]);
    useEffect(()=>{
       return () => {
        if(previewUrl) URL.revokeObjectURL(previewUrl)
       };
    },[previewUrl]);
    return (
        <div onClick={()=> inputRef.current?.click()} 
             className="flex justify-center items-center gap-2 border-transparent bg-gray-800 w-40 h-20 rounded-xl text-center cursor-pointer relative">
             {
                previewUrl ? (
                  <>
                    <img src ={previewUrl} alt="thumbnail-preview" className="object-cover w-full h-full z-0 pointer-events-none"/>
                    <span onClick={handleDeleteImg} 
                      className="absolute top-0 right-0 bg-white w-10 rounded-2xl z-10 text-xl font-semibold text-black cursor-pointer ">X</span>
                  </>
                ):(
                    <button type="button" className="flex justify-center items-center gap-2"><Icons.Camera/>Thumbnail</button>
                )
             } 
              <input ref={inputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
        </div>
    )
};

export default ThumbnailUpload;