import {Request, Response, NextFunction} from 'express';

export const errorHandler = (err: any, req: Request, res:Response, next: NextFunction) : void => {

    console.error(err.stack);


if(err.name === 'ValidationError'){
    const errors = Object.values(err.errors).map((e:any) => e.message);
    res.status(400).json({message: 'Validation Error', errors});
}

if(err.code === 1000){
    res.status(401).json({message: 'Invalid token'});
}

res.status(503).json({message:'Internal Server Error'});
}