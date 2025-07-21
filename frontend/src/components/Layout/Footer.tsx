import { memo } from "react";


interface FooterProps{
  children?: React.ReactNode;
  className?: string;
};

const Footer:React.FC<FooterProps> = ({children,className}) => {
    return(
        <footer className={`footer border-t-1 border-black px-14 py-6 
           flex item-center gap-20 lg:gap-80 z-10 w-full
           ${className}`}>
            <div className="copyright-year">
              <p className="text-md font-medium">&copy; {new Date().getFullYear()} BlogHorizon</p>
            </div>
            {children}
        </footer>
    )
};

export default memo(Footer);