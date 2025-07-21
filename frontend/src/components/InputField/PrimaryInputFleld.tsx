import { memo, ReactNode } from "react";
import { BasicInputFieldProps } from "./type";


interface PrimaryInputFieldProps extends BasicInputFieldProps{
  icon?: ReactNode;
}

const PrimaryInputField:React.FC<PrimaryInputFieldProps> = ({className = '',id,name,type,icon,value,onChange,placeholder}) => {
    return(
        <div className="relative w-full">
            {icon && <span className="absolute left-3 top-1/2  -translate-y-1/2">{icon}</span>} 
            <input 
              className= {`block w-full indent-8 
                ${className}`}
              id={id}
              name={name} 
              type={type} 
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              autoComplete="current-password"
            />
        </div>
    )
}
export default memo(PrimaryInputField);