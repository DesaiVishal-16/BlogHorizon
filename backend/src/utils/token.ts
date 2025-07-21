import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const createAccessToken = (userId: string):string => { 
    const secret= process.env.JWT_SECRET;
    if(!secret){
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign({id: userId}, secret, {expiresIn: process.env.JWT_ACCESS_EXPIRES_IN  || '1h'} as jwt.SignOptions);
};

export const createRefreshToken = (userId: string):string => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if(!secret){
        throw new Error('JWT_REFRESH_SECRET  environment variable is not set');
    }
    return jwt.sign({id: userId}, secret, {expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'} as jwt.SignOptions);
};

export const sendAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    res.cookie('accessToken',accessToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};