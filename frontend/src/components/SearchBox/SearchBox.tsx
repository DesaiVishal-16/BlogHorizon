import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Icons } from "../icons";

const SearchBox:React.FC = () => {
  const [isFocused,setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(e.type === 'focus'); 
  },[]);
  useEffect(()=>{
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.ctrlKey && e.key.toLocaleLowerCase() === 'k'){
        e.preventDefault();
        inputRef.current?.focus();
      };
    };
    window.addEventListener('keydown',handleKeyDown);
    return () => window.removeEventListener('keydown',handleKeyDown);
  },[]);
    return(
      <form className="w-full lg:w-lg h-12 px-5 flex items-center gap-4 text-white rounded-lg bg-[#1c1f26]">
        <Icons.Search className="fill-[#a8b3cf] text-3xl"/>
        <input ref={inputRef} type="search" placeholder={`${isFocused ? 'Search posts or ask a question...' : 'Search'}`} 
          className="placeholder:text-[#a8b3cf] placeholder:font-bold w-full outline-none cursor-text caret-blue-500 text-lg
          "
          onFocus={handleInputFocus}
          onBlur={handleInputFocus}
        />
        <div className="text-[#a8b3cf] text-sm flex gap-1 ml-auto">
          <span className="border border-[#343a43] py-0.5 px-2 rounded-lg">Ctrl</span>
          <span>+</span>
          <span className="border border-[#343a43] py-0.5 px-2 rounded-lg">K</span>
        </div>
      </form>
    );
};
export default memo(SearchBox);