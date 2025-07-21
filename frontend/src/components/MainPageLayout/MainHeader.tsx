import { Link } from 'react-router';
import logo from '../../assets/logo.png';
import { SearchBox } from '../SearchBox';
import { useAppSelector } from '../../store/hooks';
import {capitalizeFirstLetter} from '../../utils';
import defaultProfileImg from '../../assets/user-profile-img.jpg'
import ProfileSettingCard from '../cards/ProfileSettingsCard';
import { useEffect, useRef, useState } from 'react';

const MainHeader = () => {
 const { user } = useAppSelector((state)=> state.auth); 
 const [isOpen,setIsOpen] = useState<boolean>(false);
 const cardRef = useRef<HTMLDivElement | null>(null);
 const profileBtnRef = useRef<HTMLImageElement | null>(null);
 const [imgLoaded,setImgLoaded] = useState<boolean>(false);

 useEffect(()=>{
      const handleOutsideClick = (event: MouseEvent) => {
        if(cardRef.current && !cardRef.current.contains(event.target as Node) && 
           profileBtnRef.current && !profileBtnRef.current.contains(event.target as Node)){
            setIsOpen(false);
        };
      };
      if(isOpen){
        document.addEventListener("mousedown",handleOutsideClick);
      };
      return () => {
        document.removeEventListener("mousedown",handleOutsideClick);
      };
 },[isOpen]);

    return (
        <header className='flex justify-between items-center gap-10 lg:gap-5 py-2 px-10 border-b-2 border-gray-600'>
           <Link to='/posts' className="product-name flex items-center gap-2">
              <img src={logo} alt="logo-img" width={25}/> 
              <h2 className="text-lg font-bold"><i className="text-[#62b3c5]">Blog</i><span className="text-[#ee7380]">Horizon</span></h2>
            </Link>
            <SearchBox/>
            <div className='text-white hidden lg:block lg:flex lg:items-center gap-5'>
                <span className='username text-sm'>Hi, welcome&nbsp;<span className='text-blue-200 text-lg'>{capitalizeFirstLetter(user?.username)} </span></span>
                <div className='w-12 h-12 rounded-xl cursor-pointer relative overflow-hidden'>
                  {!imgLoaded && <img src={defaultProfileImg} alt="fallback" className='w-full h-full object-cover rounded-full absolute top-0 left-0'/>}
                   <img ref={profileBtnRef} src={user?.img} onLoad={()=>setImgLoaded(true)} 
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300  
                    ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}  alt="profile-img" title='Profile-settings' onClick={() => setIsOpen((prev)=>!prev)}/>
                </div>
            </div>
            {
               isOpen && <div ref={cardRef} className='absolute top-15 right-10 z-10'><ProfileSettingCard imgLoaded={imgLoaded}/></div>
            }
        </header>
    );
};
export default MainHeader;