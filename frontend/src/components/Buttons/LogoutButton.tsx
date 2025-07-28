import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import PrimaryButton from "./PrimaryButton";
import { useLocalStorage } from "../../utils";
import { logout, logoutUser } from "../../store/slices/authSlice";
import { User } from "../../store/slices/authSlice/types";

interface LogoutButtonProps {
  className?: string;
  icon?: React.ReactNode;
}

const LogoutButton = ({ className, icon }: LogoutButtonProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [, , removeUserData] = useLocalStorage<User | null>("user", null);
  const [, , removeUserToken] = useLocalStorage<string | null>("token", null);

  const handleLogout = () => {
    try {
      removeUserData();
      removeUserToken();
      dispatch(logoutUser());
      dispatch(logout());
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <PrimaryButton
      icon={icon}
      className={className}
      name="Logout"
      onClick={handleLogout}
    />
  );
};

export default LogoutButton;
