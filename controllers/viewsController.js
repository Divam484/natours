const Tour = require("../model/tourModel");
const User = require("../model/usermodel");
const Review = require('../model/reviewModel')
const Booking = require('../model/bookingModel')
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour Data from collection
  const tours = await Tour.find();

  // 2) Build  templete

  // 3) Render that template using tour data from 1)

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get tour Data from collection with review
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }
  // 2) Build  templete

  // 3) Render that template using tour data from 1)
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getloginFrom = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: `Log into your account`,
  });
});

exports.getSignupFrom =catchAsync(async (req, res) => {
  res.status(200).render("signUp", {
    title: `Sign-up into your account`,
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: `Your account`,
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render("account", {
    title: `Your account`,
    user: updatedUser
  });
});

exports.getMyTours= catchAsync(async(req,res,next)=>{
  // 1) Find all Bookings
  const bookings = await Booking.find({ user: req.user.id })

  // 2)Find tour with returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id:{ $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
})

exports.getMyReviews= catchAsync(async(req,res,next)=>{
  // 1) Find all Bookings
  const Reviews = await Review.find({ user: req.user.id })

  // 2)Find tour with returned IDs
  const tourIDs = Reviews.map(el => el.tour);
  const tours = await Tour.find({ _id:{ $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
})