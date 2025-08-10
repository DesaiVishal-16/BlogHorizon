import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../store/hooks";
import { googleLogin } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../Buttons";
import { Icons } from "../icons";

const GoogleAuthButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(googleLogin(tokenResponse.access_token));
      navigate("/posts");
    },
    onError: () => console.error("Google login failed"),
  });

  return (
    <PrimaryButton
      name="Continue with Google"
      onClick={() => login()}
      icon={<Icons.Google />}
      className="!rounded-xl !bg-blue-800 !text-white hover:!bg-blue-700 w-full"
    />
  );
};

export default GoogleAuthButton;
