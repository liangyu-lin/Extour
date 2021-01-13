const Tour = require('../models/tour');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
mbxGeocoding({accessToken: mapBoxToken});
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});



module.exports.index = async (req, res) => {
    const tours = await Tour.find({});
    res.render('tours/index', {
        tours
    });
}


module.exports.renderNewForm = (req, res) => {

    res.render('tours/new')
}


module.exports.createTour = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.tour.location,
        limit: 1
    }).send()
    res.send(geoData.body.features[0].geometry.coordinates);
  
    // const tour = new Tour(req.body.tour);
    // tour.images = req.files.map(f => ({
    //     url: f.path,
    //     filename: f.filename
    // }))
    // tour.author = req.user._id;
    // await tour.save();
    // console.log(tour)
    // req.flash('success', 'Successfully made a new tour!');
    // res.redirect(`/tours/${tour._id}`)

}


module.exports.showTour = async (req, res) => {
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
}


module.exports.renderEditForm = async (req, res) => {

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
}


module.exports.updateTour = async (req, res) => {

    const {
        id
    } = req.params;

    const tour = await Tour.findByIdAndUpdate(id, {
        ...req.body.tour
    });
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
       tour.images.push(...imgs);
       await tour.save()
    req.flash('success', 'Successfully updated tour!');
    res.redirect(`/tours/${tour._id}`)
}


module.exports.deleteTour = async (req, res) => {
    const {
        id
    } = req.params;
    await Tour.findByIdAndDelete(id);
    res.redirect('/tours');
}