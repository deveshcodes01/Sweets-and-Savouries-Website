export function notFound(req, res) {
  res
    .status(404)
    .json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  if (err instanceof SyntaxError && "body" in err) status = 400;
  if (err.name === "ValidationError") status = 400;
  if (err.name === "CastError") status = 400;
  if (err.code === 11000) status = 409;
  console.error("API request failed", {
    name: err.name || "Error",
    status,
    code: typeof err.code === "number" ? err.code : undefined,
    method: req.method,
    path: req.path,
  });
  const message =
    status === 500
      ? "Something went wrong. Please try again later."
      : err.message;
  res.status(status).json({ message });
}
