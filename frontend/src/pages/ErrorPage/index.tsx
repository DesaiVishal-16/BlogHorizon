import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/Buttons";

const ErrorPage = () => {
   const navigator = useNavigate();
 return(
    <div className="error-page flex flex-col justify-center items-center gap-4 h-screen font-display">
         <h1 className="text-4xl font-bold text-red-600"> 404 - Page Not Found </h1> 
         <PrimaryButton name="Back to Home" onClick={()=>navigator('/posts')}/>
    </div>
 )
}

export default ErrorPage;