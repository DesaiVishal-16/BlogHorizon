import { Link } from "react-router-dom";
import { memo } from 'react';
import logo from '../../assets/logo.png';

interface NavbarProps{
    children?: React.ReactNode;
    className?: string;
}

const Navbar:React.FC<NavbarProps> = ({children,className}) => {
     
    return(
        <nav className={`navbar h-20 px-3 flex justify-between items-center border-b-1 border-black z-10
             md:px-5  lg:px-14
            ${className}`}>
            <Link to='/' className="product-name flex justify-center items-center gap-2">
            { logo &&  <img src={logo} alt="logo-img" width={40}/> }
              <h2 className="text-3xl font-bold"> <i className="text-[#62b3c5] ">Blog</i><span className="text-[#ee7380]">Horizon</span></h2>
            </Link>
              {children}   
        </nav>
    )
}

export default memo(Navbar);