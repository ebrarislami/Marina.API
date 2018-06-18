const error = (res, message, statusCode=500) => {
    res.status(statusCode).json({
        error: {
            message: message
        }
    });
  };
  
  module.exports = error;