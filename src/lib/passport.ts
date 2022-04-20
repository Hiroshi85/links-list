import { Request } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import pool from '../database';
import cryptHelpers from '../lib/bcrypt';

passport.use('local.signin', new LocalStrategy.Strategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    
    async (req: Request, username: string, password: string, done: any) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        console.log(rows)
        //@ts-ignore
        if(rows.length > 0){
            //@ts-ignore
            const user = rows[0]
            const valid = await cryptHelpers.matchPassword(password, user.password)
            if (valid){
                //@ts-ignore
                done(null, user, req.flash('success', `Welcome ${user.username}`))
            } else{
                //@ts-ignore
                done(null, false, req.flash('failure', 'Incorrect password'))
            }
        } else {
            //@ts-ignore
            done(null, false, req.flash('failure', 'The username doesn\'t exist'))
        }


    })
);

passport.use('local.signup', new LocalStrategy.Strategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, 

    async (req: Request, username: string, password:string, done) => {
        const {fullname} = req.body
        const newUser = {
            username,
            password: await cryptHelpers.encryptPassword(password),
            fullname,
            id: ''
        };
        try{
            const [row] = await pool.query('INSERT INTO users SET ?', [newUser])
            console.log(row)
            //@ts-ignore
            newUser.id = row.insertId;
            return done(null, newUser)
        }catch(e){
            if(e instanceof Error){
                //@ts-ignore
                if(e.code === "ER_DUP_ENTRY")
                    //@ts-ignore
                    return done(null, false, req.flash('failure', 'Username already exists!'))
            }
            
        }    

    })
);



passport.serializeUser((user: any, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id: number, done) =>{
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [id]);
    //@ts-ignore
    done(null, rows[0]);
    
})