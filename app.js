if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

console.log(process.env.SECRET)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressErorr = require('./utils/ExpressError');
const methodOverRide = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');


 
const usersRoutes = require('./routes/users');
const toursRoutes = require ('./routes/tours');
const reviewsRoutes = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/extour', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverRide('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

const sessionConfig = {
    name:'session',
    secret: 'thisshouldbeabetter secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet())

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=> {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', usersRoutes);
app.use('/tours', toursRoutes);
app.use('/tours/:id/reviews', reviewsRoutes);

app.get('/fakeUser', async (req, res) => {
    const user = new User ({email: 'jacklin0727@gmail.com', username: 'jacklin0727'})
    const newUser = await User.register(user, 'doughnuts');
    res.send(newUser);

})

app.get('/', (req, res) => {
    res.render('home')
});



app.all('*', (req, res, next) => {
    next(new ExpressErorr('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = 'Oh No! Something Went Wrong!'
    res.status(statusCode).render('error', { err });
});


app.listen(3000, () => {
    console.log("listen on port 3000")
});