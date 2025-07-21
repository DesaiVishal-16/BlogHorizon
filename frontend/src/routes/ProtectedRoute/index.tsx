import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

const ProtectedRoute = () => {
   const {isAuthenticated} = useAppSelector(state=>state.auth);
   return (
    <div>
      {isAuthenticated ? <Outlet/> : <Navigate to="/auth/login" replace/>} 
    </div>
   )
};

export default ProtectedRoute;