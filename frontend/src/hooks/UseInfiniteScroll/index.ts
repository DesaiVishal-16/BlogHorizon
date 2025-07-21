import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollProps{
    loading: boolean;
    hasMore: boolean;
    onLoadMore : () => void;
    threshold?: number;
}

export const UseInfiniteScroll = ({loading,hasMore,onLoadMore,threshold = 100}:UseInfiniteScrollProps) => {
     const observeRef = useRef<IntersectionObserver | null>(null);
     const lastElementRef = useCallback((node: HTMLDivElement)=>{
         if(loading)return;
         if(observeRef.current)observeRef.current.disconnect();
         observeRef.current = new IntersectionObserver(entries=>{
            if(entries[0].isIntersecting && hasMore && !loading){
                onLoadMore();
            }
         },{
            threshold: 0.1,
            rootMargin: `${threshold}px`
         });
         if(node) observeRef.current.observe(node);
     },[loading,hasMore,onLoadMore,threshold])


useEffect(()=>{
     return()=>{
        if(observeRef.current){
            observeRef.current.disconnect()
        }
     }
},[])
 
return {lastElementRef}
}
export default UseInfiniteScroll;