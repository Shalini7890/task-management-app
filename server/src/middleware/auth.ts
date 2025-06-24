import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {IUser} from '../models/User';

export interface AuthRequest extends Request {
    user?: IUser;

}
export const authenticateToken = async (req:AuthRequest, res: Response, next:NextFunction) : Promise<void>=> {
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            res.status(401).json({message:'No auth token present'});
            return;
        }
// process.env.JWT_SECRET
        const decodedToken = jwt.verify(token,  'temp-secret' ) as {userId : string};
        const user = await User.findById(decodedToken.userId).select('-password');

        if(!user){
            res.status(400).json({message:'User not found'});
            return;
        }
        req.user = user;
        next();
    }
    catch(error:any){
        console.error(error);
        
        res.status(403).json({message:'Invalid or expired token'});
        return;

    }

}