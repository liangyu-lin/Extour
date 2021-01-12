const express = require('express');
const router = express.Router({mergeParams:true});

const {validateReview, isLoggedIn, isReviewAuthor} =require('../middleware');
const Tour = require('../models/tour');
const Review = require('../models/review');


const ExpressErorr = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    tour.reviews.push(review);
    await review.save();
    await tour.save();
    req.flash('success', 'Successfully created a new review!')
    res.redirect(`/tours/${tour._id}`)
}))



router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Tour.findByIdAndUpdate(id, { $pull: {  reviews: reviewId  }})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/tours/${id}`);
}));

module.exports = router;