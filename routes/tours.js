const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const tours = require('../controllers/tours')


const {
    isLoggedIn,
    isAuthor,
    validateTour
} = require('../middleware.js');

const Tour = require('../models/tour');

router.route('/')
    .get(catchAsync(tours.index))
    .post(isLoggedIn, validateTour, catchAsync(tours.createTour))

router.get('/new', isLoggedIn, tours.renderNewForm);

router.route('/:id')
    .get(catchAsync(tours.showTour))
    .put(isLoggedIn, isAuthor, catchAsync(tours.updateTour))
    .delete(isLoggedIn, isAuthor, catchAsync(tours.deleteTour))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(tours.renderEditForm));


module.exports = router;