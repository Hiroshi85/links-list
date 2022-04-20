import {Request, Response, Router} from 'express';
import passport from 'passport';

import Auth from '../lib/auth';

class AuthRouter{
    public router: Router;
    auth: Auth;

    constructor(auth: Auth){
        this.router = Router();
        this.auth = auth;
        this.routes();
    }

    private getSignup(req: Request, res: Response): void{
        res.render('auth/signup');
    } 

    private postSignup(): void{
        passport.authenticate('local.signup', {
            successRedirect: '/profile',
            failureRedirect: '/signup',
            failureFlash: true
        });
    }

    private getProfile(req: Request, res: Response): void{
        res.render('profile');
    }

    private getSignin(req: Request, res: Response): void{
        res.render('auth/signin')
    }

    private postSignin(): void{
        passport.authenticate('local.signin', {
            successRedirect: '/profile',
            failureRedirect: '/signin',
            failureFlash: true
        })
    }

    private getLogout(req: Request, res: Response){
        req.logOut();
        res.redirect('/signin')
    }

    public routes(): void{
        this.router.get('/signup', this.getSignup);
        this.router.post('/signup', this.postSignup);
        this.router.get('/profile', this.auth.isLoggedIn, this.getProfile);
        this.router.get('/signin', this.auth.isNotLoggedIn, this.getSignin);
        this.router.post('/signin', this.postSignin);
        this.router.get('/logout', this.getLogout);
    }

}
const auth: Auth = new Auth()
const authentication: AuthRouter = new AuthRouter(auth);

export default authentication.router;