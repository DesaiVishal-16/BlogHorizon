import { Outlet } from "react-router-dom";
import MainHeader from "./MainHeader";
import MainNavBar from "./MainNavBar";

const MainPageLayout = () => {

    return(
        <div className="flex flex-col h-screen">
           <MainHeader/>
           <div className="flex flex-1 overflow-hidden">
             <MainNavBar/>
             <main className="w-full overflow-y-auto scroll-smooth">
               <Outlet/>
             </main>
           </div>
        </div>
    )
}

export default MainPageLayout;