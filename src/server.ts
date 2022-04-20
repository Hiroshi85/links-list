require('dotenv').config();

import express, {Application, Request, Response, NextFunction} from 'express';
import morgan from "morgan";

import routes from "./routes";
import authroutes from "./routes/AuthRouter";
import linkroutes from "./routes/LinkRouter";
import notfound from "./routes/NotFound"

import {engine} from "express-handlebars";
import path from 'path';
import flash from 'connect-flash';

import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import passport from 'passport';

import pool from './database';

export default class Server{
    public app: Application

    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    private setMiddlewares(){
        // @ts-ignore
        var sessionStore = MySQLStore({}, pool);

        this.app.use(session({
            secret: 'cookie-crud-links',
            //@ts-ignore
            store: sessionStore,
            resave: false,
            saveUninitialized: false
        }))
        
        this.app.use(morgan('dev'));
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.json());
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        
    }

    private setGlobal(): void{
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            this.app.locals.success = req.flash('success');
            this.app.locals.failure = req.flash('failure');
            this.app.locals.user = req.user;
            next();
        })
    }

    private configHandlebars(): void{
        this.app.set('views', path.join(__dirname, 'views'));
        const viewsDir = this.app.get('views');
        console.log(viewsDir)
        this.app.engine('.hbs', engine({
            defaultLayout: 'main',
            layoutsDir: path.join(viewsDir, 'layouts'),
            partialsDir: path.join(viewsDir, "partials"),
            extname: '.hbs',
            helpers: require('./lib/handlebars')
        }));
        
        this.app.set('view engine', '.hbs');
    }

    private setStaticPublic(): void {
        this.app.use(express.static(path.join(__dirname, 'public')))
    }

    private config(): void{
        require('./lib/passport');
        this.app.set('port', process.env.PORT || 4000);
        

        this.configHandlebars()
        
        this.setMiddlewares();
        this.setGlobal();
    }

    private routes(): void {
        this.setStaticPublic();
        this.app.use(routes);
        this.app.use(authroutes);
        this.app.use('/links', linkroutes)
        this.app.use(notfound)
    }

    public start():void {
        this.app.listen(
            this.app.get('port'), 
            () => console.log(`Escuchando en puerto ${this.app.get('port')}`)
        )
    }

}

