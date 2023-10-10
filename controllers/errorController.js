const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTErrorDB = () =>
  new AppError("Invalid Token.please log in again!", 401);

const handleTokenExpiredErrorDB = () =>
  new AppError("Your Token is Expired.__Please login again",401);

const sendErrorDev = (req,res,err) => {
  if(req.originalUrl.startsWith('/api')){
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }else{
    console.error('ERROR 💥', err);
    res.status(err.statusCode).render('error',{
      title: 'something went wrong!',
      msg: err.message
    })
  }
  
};

const sendErrorProd = (req,res,err) => {
  if(req.originalUrl.startsWith('/api')){
// A) API
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
  
      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error("ERROR 💥", err);
  
      // 2) Send generic message
      res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }else{
  // B)RENDERED WEBSITE
    if (err.isOperational) {
      res.status(err.statusCode).render('error',{
        title: 'something went wrong!',
        msg: err.message
      })
  
      // Programming or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.error("ERROR 💥", err);
  
      // 2) Send generic message
      res.status(err.statusCode).render('error',{
        title: 'something went wrong!',
        msg: 'please try again leter. '
      })
    }
  }
  
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(req,res, err);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name == "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTErrorDB();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredErrorDB();

    sendErrorProd(req,res, err);
  }
};
