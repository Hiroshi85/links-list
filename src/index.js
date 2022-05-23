require('dotenv').config();

const express = require("express")
const morgan = require("morgan")
const routes = require("./routes/")
const {engine} = require("express-handlebars")
const path = require('path');
const flash = require('connect-flash')
const cors = require('cors');

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
const passport = require('passport')

const {session_secret} = require('./keys');

const pool  = require('./database');

//Initializations
const app = express();
require('./lib/passport');

//Settings
app.set('port', process.env.PORT || 4000);

app.disable('x-powered-by');

app.set('views', path.join(__dirname, 'views'));
const viewsDir = app.get('views');

app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(viewsDir, 'layouts'),
    partialsDir: path.join(viewsDir, "partials"),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

//Conectar MySQLStore con Pool ya establecido
var sessionStore = new MySQLStore({}, pool)

//Middleware

app.use(session({
    secret: session_secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))


app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

//Global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success')
    app.locals.failure = req.flash('failure')
    app.locals.user = req.user
    next();
})


//Routes
app.use(routes)
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'))

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Error 404
app.use(require('./routes/notFound'))

//Starting server

app.listen(app.get('port'), 
    () => console.log(`Escuchando en puerto ${app.get('port')}`)
)