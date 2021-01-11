const express = require('express');
const router = express.Router({mergeParams:true});


const Tour = require('../models/tour');
const Review = require('../models/review');


const {reviewSchema} = require('../schemas.js');


const ExpressErorr = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
        
  
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErorr(msg, 400)
    } else {
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id);
    const review = new Review(req.body.review);
    tour.reviews.push(review);

    await review.save();
    await tour.save();
    req.flash('success', 'Successfully created a new review!')
    res.redirect(`/tours/${tour._id}`)
}))



router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {
        id,
        reviewId
    } = req.params;
    await Tour.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/tours/${id}`);
}));

module.exports = router;