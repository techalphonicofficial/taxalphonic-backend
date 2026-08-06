export default function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) return next(error);

  const isFileTooLarge = error.code === "LIMIT_FILE_SIZE";
  const isUniqueError = error.name === "SequelizeUniqueConstraintError";
  const isValidationError = error.name === "SequelizeValidationError";
  const fieldMessage = error.errors
    ?.map((item) => item.message)
    .filter(Boolean)
    .join(", ");
  const status = isFileTooLarge || isValidationError
    ? 422
    : isUniqueError
      ? 409
      : error.status || 500;

  res.status(status).json({
    message: isFileTooLarge
      ? "Image must be 8 MB or smaller"
      : fieldMessage || error.message || "Something went wrong",
  });
}
