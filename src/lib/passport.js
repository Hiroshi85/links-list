const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database')
const helpers = require('../lib/helpers')


passport.use('local.signin', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    
    async (req, username, password, done) => {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if(rows.length > 0){
            const user = rows[0]
            const valid = await helpers.matchPassword(password, user.password)
            if (valid){
                done(null, user, req.flash('success', `Welcome ${user.username}`))
            } else{
                done(null, false, req.flash('failure', 'Incorrect password'))
            }
        } else {
            done(null, false, req.flash('failure', 'The username doesn\'t exist'))
        }


    })
);


passport.use('local.signup', new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, 

    async (req, username, password, done) => {
        const {fullname} = req.body
        const newUser = {
            username,
            password: await helpers.encryptPassword(password),
            fullname
        };
        try{
            const [row] = await pool.query('INSERT INTO users SET ?', [newUser])
            console.log(row)
            newUser.id = row.insertId;
            return done(null, newUser)
        }catch(e){
            if(e.code === "ER_DUP_ENTRY")
                return done(null, false, req.flash('failure', 'Username already exists!'))
        }    

    })
);



passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) =>{
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [id]);
    done(null, rows[0]);
    
})