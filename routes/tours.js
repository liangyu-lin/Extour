const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {
    tourSchema
} = require('../schemas.js');
const ExpressErorr = require('../utils/ExpressError');
const Tour = require('../models/tour');


const validateTour = (req, res, next) => {

    const {
        error
    } = tourSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErorr(msg, 400)
    } else {
        next();
    }

}


router.get('/', catchAsync(async (req, res) => {
    const tours = await Tour.find({});
    res.render('tours/index', {
        tours
    });
}));

router.get('/new', (req, res) => {
    res.render('tours/new')
});

router.post('/', validateTour, catchAsync(async (req, res, next) => {

    //   if(!req.body.tour) throw new ExpressError('Invalid Tour Data', 400);
    const tour = new Tour(req.body.tour);
    await tour.save();
    req.flash('success', 'Successfully made a new tour!');
    res.redirect(`/tours/${tour._id}`)

}));

router.get('/:id', catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    res.render('tours/show', {
        tour
    });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id)
    res.render('tours/edit', {
        tour
    });
}));


router.put('/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, {
        ...req.body.tour
    })
    res.redirect(`/tours/${tour._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Tour.findByIdAndDelete(id);
    res.redirect('/tours');
}));

module.exports = router;