const Review = require("../model/reviewModel");
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);


exports.setTourUserIds = (req,res,next)=>{
    //Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

exports.createReview = factory.createOne(Review);

exports.getOneReview = factory.getOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);
