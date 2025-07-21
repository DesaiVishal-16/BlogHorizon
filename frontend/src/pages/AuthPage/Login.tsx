import { CgAsterisk } from "react-icons/cg";
import { InputPassword, PrimaryInputField } from "../../components/InputField";
import { MdOutlineMail } from "react-icons/md";
import { PrimaryButton } from "../../components/Buttons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import { fetchMe, login } from "../../store/slices/authSlice";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";

interface formDataPropsLogin{
  email: string;
  password: string;
};
const Login:React.FC = () => {
   const [showPass,setShowPass] = useState<string>('');
   const [formData,setFormData] = useState<formDataPropsLogin>({email: '', password: ''})
   const navigate = useNavigate();

   const dispatch = useAppDispatch();
   const auth = useAppSelector((state: RootState)=> state.auth);
     
   const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const resultAction =  dispatch(login(formData));
      if(login.fulfilled.match(resultAction)){
        dispatch(fetchMe());
      }
   };

   useEffect(()=>{
     if(auth.user && auth.isAuthenticated){
      navigate('/posts')
     }
   },[auth.user,auth.isAuthenticated,navigate])

    return (
        <div className="w-full xl:w-1/2 flex flex-col justify-center px-40 gap-5">
            <div className="border-b-1 border-[#f0f0f0] w-full pb-8">
              <h2 className="text-3xl font-bold ">Sign In</h2> 
            </div>
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
               {/*eamil*/}
               <label id="email" className="flex items-center font-semibold"><CgAsterisk className="text-red-500"/>Email:</label>
               <PrimaryInputField name="email" type="text" className="border-2 border-[#d9d9d9] indent-5 py-1.5 rounded-lg 
                hover:border-blue-300 focus:outline-blue-500" icon={<MdOutlineMail/>} onChange={(e)=>setFormData({...formData,email: e.target.value})}/>

               {/*password*/}
               <label id="pass" className="flex items-center font-semibold"><CgAsterisk className="text-red-500"/>Password:</label>
               <InputPassword name="pass" className="border-2 border-[#d9d9d9] indent-5 py-1.5 rounded-lg 
                hover:border-blue-300 focus:outline-blue-500" value={showPass} onChange={(e)=> {
                  setShowPass(e.target.value); setFormData({...formData, password: e.target.value})}} 
                />

               {/*sumbit*/}
               <PrimaryButton className="!rounded-xl mt-2 !bg-blue-800 hover:!bg-blue-700" 
                name={`${auth.loading ? 'Logging in...' : "Login In"}`} 
               />
                  <span className="text-xl font-semibold text-center">0R</span>
                  <GoogleAuthButton/>
             </form>
            {auth.error && <p style={{color: 'red'}}>{auth.error}</p>}
           <div className="text-md font-semibold">
             <span> Or </span> <Link to="/auth/register" className="text-blue-800 cursor-pointer"> Register now! </Link>
           </div>
        </div>
    )
};
export default Login;