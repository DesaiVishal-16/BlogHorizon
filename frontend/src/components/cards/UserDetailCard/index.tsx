import defaultProfileImg from "../../../assets/user-profile-img.jpg";
import { capitalizeFirstLetter } from "../../../utils";

interface UserDetailCardProps {
  userName: string;
  userImg: string;
  userEmail: string;
  date: string;
  imgLoaded?: boolean;
  onLoaded?: () => void;
  className?: string;
}

const UserDetailCard = ({
  userName,
  userImg,
  userEmail,
  date,
  imgLoaded,
  onLoaded,
  className,
}: UserDetailCardProps) => {
  return (
    <>
      <div
        className={`${className} bg-gray-800 w-10 m-2 h-10 rounded-xl cursor-pointer relative overflow-hidden`}
      >
        {!imgLoaded && (
          <img
            src={defaultProfileImg}
            alt="fallback"
            className={`w-full h-full object-cover absolute top-0 left-0`}
          />
        )}
        <img
          src={userImg}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 
                ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          alt="profile-img"
          onLoad={onLoaded}
        />
      </div>
      <div className="flex flex-col gap-2 p-2">
        <h4 className="text-xl font-bold">{capitalizeFirstLetter(userName)}</h4>
        <p className="flex items-center gap-2">
          <span className="text-sm text-gray-300">
            {" "}
            {`@${userEmail.split("@")[0]}`}
          </span>
          <span className="bg-gray-500 w-1 h-1 rounded-full">&nbsp;</span>
          <span className="text-xs text-gray-400">{date}</span>
        </p>
      </div>
    </>
  );
};
export default UserDetailCard;
