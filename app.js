const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Tour = require('./models/tour');
const methodOverRide = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {tourSchema, reviewSchema} = require('./schemas.js');

const catchAsync = require('./utils/catchAsync');
const ExpressErorr = require('./utils/ExpressError');
const Review =require('./models/review')

mongoose.connect('mongodb://localhost:27017/extour', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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



const validateTour = (req, res, next) => {
 
    const {error} = tourSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErorr(msg, 400)
    } else {
        next();
    }

}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
        
  
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErorr(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/tours', catchAsync(async (req, res) => {
    const tours = await Tour.find({});
    res.render('tours/index', {
        tours
    });
}));

app.get('/tours/new', (req, res) => {
    res.render('tours/new')
});

app.post('/tours', validateTour, catchAsync(async (req, res, next) => {
    //   if(!req.body.tour) throw new ExpressError('Invalid Tour Data', 400);


    const tour = new Tour(req.body.tour);
    await tour.save();
    res.redirect(`/tours/${tour._id}`)

}));

app.get('/tours/:id', catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    res.render('tours/show', {
        tour
    });
}));

app.get('/tours/:id/edit', catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id)
    res.render('tours/edit', {
        tour
    });
}));


app.put('/tours/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, {
        ...req.body.tour
    })
    res.redirect(`/tours/${tour._id}`)
}));

app.delete('/tours/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Tour.findByIdAndDelete(id);
    res.redirect('/tours');
}));

app.post('/tours/:id/reviews', validateReview, catchAsync(async(req,res)=> {
    const tour = await Tour.findById(req.params.id);
    const review = new Review(req.body.review);
       tour.reviews.push(review);
       
    await review.save();
    await tour.save();
    res.redirect(`/tours/${tour._id}`)
}))


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