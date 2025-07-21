import { ButtonProps } from "./types";


const PrimaryButton:React.FC<ButtonProps> = ({name,className,id,onClick,disabled,icon,iconPosition="left"}:ButtonProps) => {
   return (
    <button className={`  
           text-lg font-semibold text-white bg-blue-500 p-1.5 rounded-sm cursor-pointer hover:bg-blue-400 
           transition-transform duration-200 ease-in-out 
           ${className} flex justify-center items-center gap-2`} 
            id={id} 
            onClick={onClick}
            disabled={disabled} 
            >
              
              {iconPosition === "left" && icon && <span>{icon}</span> }
              {name}
              {iconPosition === "right" && icon && <span>{icon}</span> }
    </button>
   ) 
}

export default PrimaryButton;