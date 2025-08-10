import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../store/hooks";
import { googleLogin } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (response: CredentialResponse) => {
    try {
      const credential = response?.credential;
      if (credential) {
        dispatch(googleLogin(credential));
        navigate("/posts");
      } else {
        console.error("Google login response missing credential");
      }
    } catch (err) {
      console.error("Google login error: ", err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.error("Google login failed")}
      theme="outline"
      size="large"
      width="100%"
    />
  );
};

export default GoogleAuthButton;
