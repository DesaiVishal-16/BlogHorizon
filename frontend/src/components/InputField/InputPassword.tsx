import { BasicInputFieldProps } from "./type";
import { TbLockPassword } from "react-icons/tb";
import { LiaEyeSolid } from "react-icons/lia"; 
import { LiaEyeSlashSolid } from "react-icons/lia";
import { useState,memo } from "react";

       

const InputPassword:React.FC<BasicInputFieldProps> = ({className,id,name,placeholder,value,onChange}) => {
   const [isShowPass,setIsShowPass] = useState<boolean>(false); 
      
   function handleClick():void{
      setIsShowPass(prev => !prev);
   }
   
 return(
<div className="relative w-full">
            <TbLockPassword className="absolute left-3 top-1/2  -translate-y-1/2"/>
            <input 
              className= {`block w-full indent-8 
                ${className}`}
              id={id}
              name={name} 
              type={isShowPass ? "text" : "password"} 
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              autoComplete="current-password"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={handleClick}>
              {isShowPass ? <LiaEyeSolid/> : <LiaEyeSlashSolid/>}
            </span>
        </div>
 )
};
export default memo(InputPassword);