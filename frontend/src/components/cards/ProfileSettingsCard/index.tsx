import { useAppSelector } from "../../../store/hooks";
import { Icons } from "../../icons";
import { LogoutButton } from "../../Buttons";
import { NavLink } from "react-router-dom";
import UserDetailCard from "../UserDetailCard";

interface Props{
    className?: string;
    imgLoaded: boolean;
};

const ProfileSettingCard = ({className,imgLoaded}:Props) => {
    const user =  useAppSelector((state)=>state.auth.user);
    const date = new Date(user?.createdAt as string);
    let formattedDate = date.toLocaleString("en-US", {month: "long", year: "numeric"});
    
    return(
        <div className={`${className} text-white border-2 border-gray-600 w-72 p-2 rounded-xl bg-gray-900`}>
            <div className="flex flex-col justify-between">
                {user && 
               <UserDetailCard userName={user?.username} userImg={user?.img} userEmail={user?.email} imgLoaded={imgLoaded} date={`Joined ${formattedDate}`}/> 
                }
                <div className="">
                    <ul className="flex flex-col cursor-pointer">
                        <li className="text-gray-400 text-lg hover:bg-gray-500 hover:text-white rounded-lg px-4 py-1"> 
                           <NavLink to={`/profile/@${user?.username}`} className="flex items-center gap-4 "> <Icons.UserIcon/> <span className="font-bold">Profile</span> </NavLink>
                         </li>
                        <li className="px-2 hover:!bg-gray-500 rounded-lg"> 
                            <LogoutButton icon={<Icons.LogoutIcon className="text-2xl font-bold"/>} className="!bg-transparent !transition-none !scale-none !text-gray-400 !p-none !font-bold hover:!text-white"/> 
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingCard;