import { useState } from "react";

interface Props{
    tags: string[];
    onChange: (tags:string[]) => void;
}
const PostTags = ({tags,onChange}: Props) => {
    const [inputVal,setInputVal] = useState<string>('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
       if(e.key === "Enter" && inputVal.trim() !== ""){
        e.preventDefault();
        onChange([...tags,inputVal.trim()]);
        setInputVal("");
       }
    }
    const handleRemoveTag = (tagToRemove:string) => {
       onChange(tags.filter((tag)=> tag !== tagToRemove)); 
    };
    return(
        <div className="w-full py-2 px-4 border-none outline outline-gray-600 indent-4 rounded-lg flex flex-col gap-2">
          <input className="w-full border-none outline-none" type="text" placeholder="Add Tags" value={inputVal} onChange={(e)=>setInputVal(e.target.value)}
           onKeyDown={handleKeyDown} 
          />
            <ul className="list-none flex flex-wrap items-center gap-4 ">
              {
                tags && tags.map((tag,idx)=>(
                    <li key={idx} className="flex items-center gap-2 pr-2 py-1 bg-slate-500 rounded-lg text-sm text-center">#{tag} 
                        <button type="button" className="cursor-pointer text-sm font-bold" onClick={()=>handleRemoveTag(tag)}>&times;</button>
                    </li>
                ))
              }
            </ul>
        </div>
    )
}

export default PostTags;