import {
  BiSolidUpvote,
  BiSolidDownvote,
  BiUpvote,
  BiDownvote,
} from "react-icons/bi";
import {
  RiMenuFoldFill,
  RiMenuUnfold3Fill,
  RiArrowDropDownLine,
} from "react-icons/ri";
import {
  FaUserCircle,
  FaRegComment,
  FaRegBookmark,
  FaFire,
} from "react-icons/fa";
import { IoEyeSharp, IoSearchSharp, IoImageSharp } from "react-icons/io5";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { PiLinkSimpleBold } from "react-icons/pi";
import { MdAdd } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { TbLogout } from "react-icons/tb";
import { IoMdCamera } from "react-icons/io";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { BsGoogle } from "react-icons/bs";

const Icons = {
  Profile: FaUserCircle,
  Following: AiOutlineUsergroupAdd,
  Explore: FaFire,
  History: IoEyeSharp,
  Add: MdAdd,
  MenuClose: RiMenuFoldFill,
  Search: IoSearchSharp,
  MenuOpen: RiMenuUnfold3Fill,
  UserIcon: FaUser,
  LogoutIcon: TbLogout,
  Camera: IoMdCamera,
  Images: IoImageSharp,
  UpVoteBefore: BiUpvote,
  UpVoteAfter: BiSolidUpvote,
  DownVoteBefore: BiDownvote,
  DownVoteAfter: BiSolidDownvote,
  Comments: FaRegComment,
  Bookmark: FaRegBookmark,
  CopyLink: PiLinkSimpleBold,
  ShareLink: FaShareFromSquare,
  Cancel: MdOutlineCancel,
  DropDownLine: RiArrowDropDownLine,
  Google: BsGoogle,
};

export default Icons;
