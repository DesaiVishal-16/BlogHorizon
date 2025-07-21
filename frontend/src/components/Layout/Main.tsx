import { memo, ReactNode } from "react";

interface MainProps{
   children?: ReactNode;
};
const Main:React.FC<MainProps> = ({children}) => {
 return (
    <div className="flex-grow z-0 overflow-hidden">
       {children}
    </div>
 )
};

export default memo(Main);