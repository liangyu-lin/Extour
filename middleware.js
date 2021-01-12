 const {tourSchema, reviewSchema} = require('./schemas.js');
 const ExpressErorr = require('./utils/ExpressError');
const Tour = require('./models/tour');
const Review = require ('./models/review');


 module.exports.isLoggedIn = isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated ()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateTour = (req, res, next) => {

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

module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params;
    const tour = await Tour.findById(id);
    if (!tour.author.equals(req.user._id)) {
        req.flash('error', 'You do not have legal permission to do that!');
        return res.redirect(`/tours/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body);


    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErorr(msg, 400)
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const tour = await Review.findById(reviewId);
    if (!tour.author.equals(req.user._id)) {
        req.flash('error', 'You do not have legal permission to do that!');
        return res.redirect(`/tours/${id}`);
    }
    next();
}