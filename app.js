if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsEngine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const MongoDBStore = require("connect-mongo");


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/uncproject';



const mongoSanitize = require('express-mongo-sanitize');

const usersRoutes = require('./routes/users')
const rosterRoutes = require('./routes/roster');
const takesRoutes = require('./routes/takes');
const prospectRoutes = require('./routes/prospect');
const scoutRoutes = require('./routes/scouting');


mongoose.set('strictQuery', true);
// can remove if need be


mongoose.connect( dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsEngine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'uncTarheel2023';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 3600
})

// may have to delete this****

store.on("error", function(e) {
    console.log("Session Store Error", e)
})



app.use(session({
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 *3600}),
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60* 24* 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());




app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.signedIn = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})



app.get('/', (req, res) => {
    res.render('home');
});


app.use('/', usersRoutes);
app.use('/UNCroster', rosterRoutes);
app.use('/UNCroster/:id/take', takesRoutes);
app.use('/prospects', prospectRoutes);
app.use('/prospects/:id/scout', scoutRoutes);




app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something Went Wrong!"
    res.status(statusCode).render('error', {err});

});

app.listen(3000, () => {
    console.log('Serving on port 3000')
});
