import { LogoutButton, PrimaryButton } from "../Buttons";
import { NavLink, useNavigate } from "react-router-dom";
import { Icons } from "../icons";
import { memo, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { removeSpaces } from "../../utils";

const MainNavBar:React.FC = () => {
 const [isToggle,setIsToggle] = useState<boolean>(false);
 const { user } = useAppSelector((state)=>state.auth);
 const navigate = useNavigate(); 
 const navItems = [
    {name: "Profile", path:`/profile/@${removeSpaces(user?.username as string)}`, icon: Icons.Profile},
    {name: "Following", path:`/following@${removeSpaces(user?.username as string)}`, icon: Icons.Following},
    {name: "Explore", path:'/posts', icon: Icons.Explore},
    {name: "History", path:`/history/@${removeSpaces(user?.username as string)}`, icon: Icons.History},
 ];
 const navLinkClass = ({isActive}:{isActive:boolean}) => `
   flex items-center gap-4 py-1 px-2 transition-all ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}
   `;
  const handleToggle = () => {
     setIsToggle(prev => !prev); 
  }; 
return(
  <nav className="">
    <div className={`w-1/6 min-w-[200px] h-full lg:flex sm:flex flex-col text-white border-r-2 border-gray-600 py-5
       ${isToggle ? 'lg:hidden sm:block' : 'sm:hidden lg:block'}`}>
       <div className="flex flex-col gap-5 px-3">
        <div className="flex justify-between items-center">
          <h4 className="text-gray-400 font-bold text-md">Menu</h4>
          <Icons.MenuClose className="cursor-pointer text-2xl transition-all" onClick={handleToggle}/>
        </div>
        <div>
          <PrimaryButton name='New Post' icon={<Icons.Add className="text-2xl"/>} 
          className='flex justify-center items-center bg-white !text-black !font-semibold !text-sm 
          !rounded-xl hover:!bg-gray-200 w-full'
           onClick={()=>navigate('/create-new-post')} 
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto mt-5 pl-2 cursor-pointer">
        {
          navItems.map((item,index)=>(
            <NavLink key={index} to={item.path} className={navLinkClass}>
              {item.icon && <item.icon className="text-xl"/>}
              <span>{item.name}</span>
            </NavLink>            
          ))
        }
      </div>
      <div className="mt-auto px-3">
        <LogoutButton className="w-full"/>
      </div>
    </div>
      <Icons.MenuOpen className='m-5 text-2xl cursor-pointer text-white transition-all' onClick={handleToggle}/>
  </nav>
 );
};
export default  memo(MainNavBar);