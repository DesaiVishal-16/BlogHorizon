import Layout from "../../components/Layout/Layout";
import { PrimaryButton } from '../../components/Buttons';
import { NavLink, useNavigate } from 'react-router';
import landingImg from '../../assets/landing-img.png'
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
import { fetchMe } from "../../store/slices/authSlice";

const LandingPage:React.FC = () => {
   const navigate = useNavigate();
   const auth = useAppSelector(state=>state.auth);
   const dispatch = useAppDispatch();

   const handleSignIn = () => {
        dispatch(fetchMe());     
   };
   useEffect(()=>{
      if(auth.user && auth.isAuthenticated){
         navigate('/posts');
      }
   },[auth.user, auth.isAuthenticated, navigate]);

 return (
    <Layout className="bg-[#f7f4ed]  overflow-hidden"
     navbarExtra={ 
        <div className='navbar-links flex justify-around items-center gap-5'>
            <NavLink to={'/create-new-post'} className='text-md font-medium cursor-pointer sr-only sm:not-sr-only'>Write</NavLink>
            <NavLink to={'/auth/login'} onClick={handleSignIn} className='text-md font-medium cursor-pointer'>Sign</NavLink>
            <PrimaryButton name='Get started'
            className='!bg-black !rounded-full !text-sm px-4 py-3 ' 
            onClick={()=>navigate('/auth/register')}/>
        </div>} 

    mainExtra={
       <div className="flex justify-between items-center">
          <div className="left-side flex flex-col gap-10 p-20">
            <h2 className="text-8xl">Human <br/> stories & ideas</h2>
            <span className="text-2xl font-sm">A place to read, write, and deepen your understanding</span>
            <PrimaryButton className="!w-50 !text-2xl !rounded-full !bg-black !py-3" name="Start reading" onClick={()=>navigate('/auth/register')}/>
          </div>
          <div className="right-side sr-only xl:not-sr-only">
            <img className='w-md overflow-hidden opacity-90' src={landingImg} alt="landing-img"/> 
          </div>
       </div>
    } 
    
    showFooter={true}

    footerExtra={
       <ul className="flex flex-wrap sr-only sm:not-sr-only justify-around items-center  gap-5 md:gap-5  xl:gap-20 font-normal cursor-pointer">
         <li>Help</li>
         <li>About</li>
         <li>Blog</li>
         <li>Privacy</li>
         <li>Terms</li>
       </ul>
    }
    />
 )
};

export default LandingPage;