import { NextFunction, Request, Response } from "express";
import  bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { UserType } from "../models/User";
import { OAuth2Client, TokenPayload as GoogleTokenPayload } from "google-auth-library";
import { createAccessToken, createRefreshToken, sendAuthCookies } from "../utils/token";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

if(!process.env.JWT_SECRET){
  throw new Error("JWT secret is not defined");
}
if(!process.env.JWT_REFRESH_SECRET){
  throw new Error("JWT refresh secret is not defined");
}
export interface TokenPayload extends JwtPayload{
  id: string;
}
const registerUser = async(req:Request,res:Response,next:NextFunction): Promise<Response | void> => {
    try{
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({success: false, message: "Username, Email, Password are requried"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
           return res.status(400).json({success: false, message: "User already exists."})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser:UserType = new User({
             username,email,password: hashedPassword,                
           });
           const savedUser = await newUser.save();
           const accessToken = createAccessToken(savedUser.id.toString())
           const refreshToken = createAccessToken(savedUser.id.toString())
           sendAuthCookies(res,accessToken,refreshToken);
           const sanitizedUser = savedUser.toObject() as Partial<UserType>;
           delete sanitizedUser.password;
           return res.status(201).json({success: true, user: sanitizedUser}); 
    }catch(err){
       next(err);
    }
};

const loginUser = async(req:Request,res:Response,next:NextFunction): Promise<Response | void>=> {
      try{
        const { email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({success: false, message: "Email and password are required"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }
         const isMatch = await bcrypt.compare(password,user.password!);
         if(!isMatch){
            return res.status(401).json({success:false,message: "Invalid credentials"});
         }
          const accessToken = createAccessToken(user.id.toString());
          const refreshToken = createRefreshToken(user.id.toString());
          sendAuthCookies(res,accessToken,refreshToken); 
          const sanitizedUser = user.toObject() as Partial<UserType>;
          delete sanitizedUser.password;
        return res.status(200).json({success: true, user: sanitizedUser});
      }catch(err){
        next(err);
      } 
};

const logout = (req:Request, res: Response) => {
    res.clearCookie('accessToken',{ httpOnly: true, secure: process.env.NODE_ENV === "production" ,sameSite: 'strict',path: '/'});
    res.clearCookie('refreshToken',{ httpOnly: true, secure: process.env.NODE_ENV === "production" ,sameSite: 'strict',path: '/'});
    return res.status(200).json({success: true, message: "Logout successfully"}); 
};

const refreshToken = async(req: Request, res: Response) =>{
   const  refreshToken = req.cookies.refreshToken;
   
   if(!refreshToken){
    return res.status(400).json({success: false, message: "Unauthorized, no refresh token"})
   };
   try{
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
      const user = await User.findById(decoded.id);
      if(!user){
        return res.status(403).json({success: false, message: "User not found"});
      }
      const newAccessToken = createAccessToken(decoded.id);
      res.cookie  ('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      })
      return res.status(200).json({success: true, message: 'Token refreshed successfully' });
   }catch(err){
      return res.status(403).json({success: false, message: 'Invalid refresh token' });
   }    
};


 const googleSignIn = async (req: Request,res:Response):Promise<Response>=>{
    try{
        const {token} = req.body;
        if(!token){
          console.error("No token provided");
          return res.status(400).json({success: false, message: "No token provided"})
        }
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload: GoogleTokenPayload | undefined = ticket.getPayload(); 
        if(!payload){
            console.error("Invlaid google token");
            return res.status(400).json({success: false, message: "Invalid Google token"});
        }
        const { name, email, picture} = payload;  
        let user = await User.findOne({email});
        if(!user){
           user = new User({username: name, email, img: picture,googleId: payload.sub});
           await user.save();
        }
        const accessToken = createAccessToken(user.id.toString());
        const refreshToken = createRefreshToken(user.id.toString());
        sendAuthCookies(res, accessToken, refreshToken);
        
        const sanitizedUser = user.toObject() as Partial<UserType>;
        delete sanitizedUser.password;
        
        return res.json({success: true, user: sanitizedUser});
    }catch(err){
      console.error("Google authentication failed",err);
      return res.status(400).json({success: false, message: "Google authentication failed"})
    };
};



 const googleAuthSuccess = async(req: Request, res: Response) => {
    if(!req.user){
      return res.status(401).json({success: false,message: 'Authentication failed' });
    };
    const user = req.user as UserType;

    const accessToken = createAccessToken(user.id.toString());
    const refreshToken = createRefreshToken(user.id.toString());
    sendAuthCookies(res, accessToken, refreshToken);
    
    res.redirect(`${process.env.FRONTEND_URL}/posts`);
};


export {registerUser,loginUser,logout,refreshToken, googleSignIn,googleAuthSuccess};