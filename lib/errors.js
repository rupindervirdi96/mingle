class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const badRequest = (message) => new HttpError(400, message);
const forbidden = (message = "You are not allowed to do that.") =>
  new HttpError(403, message);
const notFound = (message = "Not found.") => new HttpError(404, message);

// Express error middleware: every route throws and this formats the response.
const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(404).json({ message: "Not found." });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 ? "Something went wrong. Please try again." : err.message,
  });
};

module.exports = { HttpError, badRequest, forbidden, notFound, errorHandler };
