import { NextFunction, Request, Response } from "express";


export const errorHandler = (err:any,req:Request,res:Response,next:NextFunction):void => {
   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
   res.status(statusCode);

   console.error(err.stack);

   res.json({
    success: false,
    message: err.message || 'Internal Sever Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
   });
};