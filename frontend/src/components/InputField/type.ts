import React from "react";

export interface BasicInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement>{
   className?: string;
   id?: string;
   name?: string;
   type?: string;
   placeholder?:string;
   value?: string;
   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}