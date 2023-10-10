const express = require("express");
const tourcontroller = require("./../controllers/tourController");
const authController = require("../controllers/authController");
// const reviewController = require("../controllers/reviewController");
const reviewRouter = require("./reviewRoutes");
const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

// router.param('id',tourcontroller.checkID)

router
  .route("/top-5-cheap")
  .get(tourcontroller.aliasTopTours, tourcontroller.getAllTours);

router.route("/tour-stats").get(tourcontroller.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourcontroller.getMonthlyPlan
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourcontroller.getTourWithin);

router.route("/distances/:latlng/unit/:unit").get(tourcontroller.getDistances);

router
  .route("/")
  .get(tourcontroller.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourcontroller.createTour
  );

router
  .route("/:id")
  .get(tourcontroller.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourcontroller.uploadTourImages,
    tourcontroller.resizeTourImages,
    tourcontroller.modifyTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourcontroller.deleteTour
  );

module.exports = router;
