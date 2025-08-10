import { PrimaryButton } from "../../components/Buttons";
import { CgAsterisk } from "react-icons/cg";
import { FiUser } from "react-icons/fi";
import { InputPassword, PrimaryInputField } from "../../components/InputField";
import { MdOutlineMail } from "react-icons/md";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, signup } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/hooks";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

interface FormDataPropsSignup {
  username: string;
  email: string;
  password: string;
}

const Register: React.FC = () => {
  const [showPass, setShowPass] = useState<string>("");
  const [formData, setFormData] = useState<FormDataPropsSignup>({
    username: "",
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(signup(formData));
    if (signup.fulfilled.match(resultAction)) {
      navigate("/posts");
    }
  };
  const handleGuestSignUp = async () => {
    const resultAction = await dispatch(
      login({ email: "guest@blogHorizon.com", password: "123456" })
    );
    if (login.fulfilled.match(resultAction)) {
      navigate("/posts");
    }
  };

  return (
    <div className="w-full xl:w-1/2 flex flex-col justify-center px-40 gap-5">
      <div className="border-b-1 border-[#f0f0f0] w-full pb-8">
        <h2 className="text-3xl font-bold">Sign Up</h2>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/*name*/}
        <label id="name" className="flex items-center font-semibold">
          <CgAsterisk className="text-red-500" /> Name:
        </label>
        <PrimaryInputField
          name="name"
          type="text"
          className="border-2 border-[#d9d9d9] indent-5 py-1.5 rounded-lg 
                hover:border-blue-300 focus:outline-blue-500"
          icon={<FiUser />}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />

        {/*eamil*/}
        <label id="email" className="flex items-center font-semibold">
          <CgAsterisk className="text-red-500" />
          Email:
        </label>
        <PrimaryInputField
          name="email"
          type="text"
          className="border-2 border-[#d9d9d9] indent-5 py-1.5 rounded-lg 
                hover:border-blue-300 focus:outline-blue-500"
          icon={<MdOutlineMail />}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/*password*/}
        <label id="pass" className="flex items-center font-semibold">
          <CgAsterisk className="text-red-500" />
          Password:
        </label>
        <InputPassword
          name="pass"
          className="border-2 border-[#d9d9d9] indent-5 py-1.5 rounded-lg 
                hover:border-blue-300 focus:outline-blue-500"
          value={showPass}
          onChange={(e) => {
            setShowPass(e.target.value);
            setFormData({ ...formData, password: e.target.value });
          }}
        />

        {/*sumbit*/}
        <PrimaryButton
          type="submit"
          name="Register"
          className="!rounded-xl mt-2 !bg-blue-800 hover:!bg-blue-700"
        />
        <span className="text-xl font-semibold text-center">0R</span>
        <PrimaryButton
          name="Register As A Guest"
          onClick={handleGuestSignUp}
          className="!rounded-xl mt-2 !bg-blue-800 hover:!bg-blue-700"
        />
        <span className="text-xl font-semibold text-center">0R</span>
        <div className="w-full">
          <GoogleAuthButton />
        </div>
      </form>
      <div className="text-md font-semibold">
        <span> Or </span>{" "}
        <Link to="/auth/login" className="text-blue-800 cursor-pointer">
          Already Have Account Login{" "}
        </Link>
      </div>
    </div>
  );
};

export default Register;
