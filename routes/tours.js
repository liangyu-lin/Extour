const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const {
    isLoggedIn,
    isAuthor,
    validateTour
} = require('../middleware.js');

const Tour = require('../models/tour');




router.get('/', catchAsync(async (req, res) => {
    const tours = await Tour.find({});
    res.render('tours/index', {
        tours
    });
}));

router.get('/new', isLoggedIn, (req, res) => {

    res.render('tours/new')
});

router.post('/', isLoggedIn, validateTour, catchAsync(async (req, res, next) => {

    const tour = new Tour(req.body.tour);
    tour.author = req.user._id;
    await tour.save();
    req.flash('success', 'Successfully made a new tour!');
    res.redirect(`/tours/${tour._id}`)

}));

router.get('/:id', catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    
    if (!tour) {
        req.flash('error', 'Cannot find the tour you are searching for!')
        return res.redirect('/tours');
    }
    res.render('tours/show', {
        tour
    });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {

    const {
        id
    } = req.params;
    const tour = await Tour.findById(id)

    if (!tour) {
        req.flash('error', 'Cannot find the tour you are searching for!')
        return res.redirect('/tours');
    }

    res.render('tours/edit', {
        tour
    });
}));


router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {

    const {
        id
    } = req.params;

    const tour = await Tour.findByIdAndUpdate(id, {
        ...req.body.tour
    })
    req.flash('success', 'Successfully updated tour!');
    res.redirect(`/tours/${tour._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Tour.findByIdAndDelete(id);
    res.redirect('/tours');
}));

module.exports = router;