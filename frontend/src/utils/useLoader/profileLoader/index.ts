import { LoaderFunction, LoaderFunctionArgs, redirect } from "react-router-dom";
import { store } from "../../../store";

export const validateUsername = (userName: string) => {
    const state = store.getState();
    let storedUserName = state.auth?.user?.username; 
    if(!storedUserName){
        return false;
    }
     userName = userName.replace(/^@/,"");
     storedUserName = storedUserName.trim().replace(/\s+/g,"");
    return storedUserName === userName;
};

const profileLoader:LoaderFunction = async({params}:LoaderFunctionArgs) => {
    const {username} = params;
    if(!username || !validateUsername(username)){
        return redirect('/error-page')
    }
    return null;
};

export default profileLoader;