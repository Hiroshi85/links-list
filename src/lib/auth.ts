import {Request, Response, NextFunction} from 'express';

export default class Auth{
    public isLoggedIn(req: Request, res: Response, next: NextFunction){
        if(req.isAuthenticated()){
            return next()
        }
        return res.redirect('/signin')
    }

    public isNotLoggedIn(req: Request, res: Response, next: NextFunction){
        if(!req.isAuthenticated()){
            return next()
        }
        return res.redirect('/profile')
    }
}