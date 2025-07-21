import { useNavigate, useParams } from 'react-router';
import logo from '../../assets/logo.png'
import Register from './Register';
import Login from './Login';

const Auth:React.FC = () => {
   const { type } = useParams();
   const navigate = useNavigate();

    return(
        <div className="flex h-screen ">
            <div className="w-1/2 bg-[#f9fafc] hidden xl:flex flex-col justify-center items-center gap-10 ">
             <div className="flex justify-center items-center gap-5 cursor-pointer" onClick={()=>navigate('/')}>
              <img src={logo} alt="logoImage" className="w-15"/>
              <h2 className="text-3xl font-bold"><i className="text-[#62b3c5] ">Blog</i><span className="text-[#ee7380]">Horizon</span></h2>
             </div>
              <span className="text-xl font-sm">A place to read, write, and deepen your understanding</span>
            </div>
            { type === "register" ? <Register/> : <Login/>}
        </div>
    )
};

export default Auth;