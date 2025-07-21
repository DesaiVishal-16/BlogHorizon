import Navbar from './Navbar';
import Footer from './Footer';
import Main from './Main';
import { memo, ReactNode, useMemo } from 'react';

interface LayoutProps{
    className: string;
    navbarExtra?: ReactNode;
    footerExtra?: ReactNode;
    mainExtra?: ReactNode;
    showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = memo(({className,navbarExtra,mainExtra,footerExtra,showFooter}) => {
    const memoizedNavbar = useMemo(()=>(
        <Navbar> {navbarExtra} </Navbar>
    ),[navbarExtra]);
    const memoizedMain = useMemo(()=>(
        <Main>{mainExtra} </Main>
    ),[mainExtra]);
    const memoizedFooter = useMemo(()=>(
          showFooter ?   <Footer> {footerExtra}</Footer> : null
    ),[showFooter,footerExtra]);
    return(
        <div className={`flex flex-col justify-between h-screen overflow-hidden ${className}`}>
            {memoizedNavbar} 
            {memoizedMain}
            {memoizedFooter}
        </div>
    )
});

export default Layout;
