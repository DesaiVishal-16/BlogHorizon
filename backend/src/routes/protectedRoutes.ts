import express,{ Request, Response,Router} from "express"
import protect from "../middlewares/auth";

const protectedRoutes: Router  = express.Router();

protectedRoutes.get('/profile',protect,(req: Request,res:Response)=>{
  res.json({success: true, message: 'Access granted', user: req.user})
})

export default protectedRoutes;