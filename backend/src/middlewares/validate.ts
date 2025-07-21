import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";


export const validateBody = (schema:ObjectSchema) => {
 return (req:Request,res:Response,next: NextFunction): Response | void => {
    const result = schema.validate(req.body, {abortEarly: false});
    if(result.error){
       const errors = result.error.details.map((detail)=> detail.message);
       return res.status(400).json({success: false,errors});
    }
    req.body = result.value; 
    next();
 };
};