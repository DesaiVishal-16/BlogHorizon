import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T):[T, (value: T | ((prevValue: T)=>T))=>void,()=>void]{
 const [storedValue,setStoredValue] = useState<T>(()=>{
       try{
         const item = window.localStorage.getItem(key) ;
        return item ? JSON.parse(item) : initialValue; 
       }catch(err){
           console.warn(`Error reading localStorage key ${key}:`,err);
           return initialValue;
       }
 });

 const setValue = (value: T | ((prevValue: T)=> T)) => {
    try{
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key,JSON.stringify(valueToStore))
    }catch(err){
       console.warn(`Error setting localStorage key "${key}": `,err);
    }
 }

 const removeValue = () =>{
   try{
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
   }catch(err){
      console.error("Error Removing LocalStorage",err);
   }
 }
 return [storedValue, setValue,removeValue] as const;
};

export default useLocalStorage;
