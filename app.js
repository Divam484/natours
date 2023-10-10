const path = require("path");
const express = require("express");

// Start express App
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require('./routes/bookingRoutes')
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const viewRouter = require('./routes/viewRoutes')
const cookieParser = require('cookie-parser')
const compression = require('compression')
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//1 GLOBAL middleware
//serve static file
app.use(express.static(path.join(__dirname, "public")));

//set securityHTTP middleware
app.use( helmet() );
app.use(function(req, res, next) { 
  res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com" ); 
  next(); 
})

//Devlopment  logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//limit requests from same Api
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "Too many requests from this IP,please try again in An hour!",
});

app.use("/api", limiter);

//Bodyparser , reading data from body in req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended:true , limit : '10kb'}))
app.use(cookieParser())

//Data sanitization against NoSql query injection
app.use(mongoSanitize());
//Data sanitization against XSS

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});
app.use(compression())
//3 Routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);



app.all("*", (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
