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




router.get('/', catchAsync(tours.index));

router.get('/new', isLoggedIn, tours.renderNewForm);

router.post('/', isLoggedIn, validateTour, catchAsync(tours.createTour));

router.get('/:id', catchAsync(tours.showTour));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(tours.renderEditForm));


router.put('/:id', isLoggedIn, isAuthor, catchAsync(tours.updateTour));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(tours.deleteTour));

module.exports = router;