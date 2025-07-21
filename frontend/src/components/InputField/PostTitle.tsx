import { useEffect, useRef, useState } from "react";
import { capitalizeFirstLetter } from "../../utils";

interface Props{
  value: string;
  onChange:(value: string) => void;
};

const PostTitle = ({value,onChange}:Props) => {
    const [isInputVisible,setIsInputVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);  
    
    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
       const value = e.target.value;
       const captialize = capitalizeFirstLetter(value);
       onChange(captialize);
    };
    useEffect(()=>{
      if(isInputVisible) inputRef.current?.focus();
    },[isInputVisible]);

    useEffect(()=>{
      const handleClickOutside = (event:MouseEvent) => {
        if(containerRef.current && !containerRef.current.contains(event.target as Node) && value.trim() === ""){
          setIsInputVisible(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    },[value]);
    return(
        <div ref={containerRef} onClick={()=>setIsInputVisible(true)} className="w-full border-none rounded-lg p-2 bg-gray-800 hover:shadow-[inset_4px_0_0_0_#ffff]">
            {
              isInputVisible ? (
                <div className="flex flex-col">
                  <label className="ml-2 text-sm text-white">Post Title *</label>
                  <input ref={inputRef} value={value} onChange={handleChange} className="indent-2 text-lg text-gray-50 font-semibold border-none outline-none
                    placeholder:text-gray-400 placeholder:text-base" type="text" placeholder="Give your post a title"
                    required/>
                </div>
                ):(
                <div>
                  <h2 className="text-lg ml-4 font-semibold">Post Title *</h2>
                </div>
                )
            }
        </div>
    )
};
export default PostTitle;