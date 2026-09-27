export const errorHandler = (err, req, res, next) => {
  // Log full internal error server-side for developer diagnostics
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  const statusCode = err.statusCode || 500;
  let clientMessage = err.message || "I'm having trouble connecting right now. Please try again in a moment.";

  // Conceal sensitive errors in production
  if (statusCode === 500) {
    clientMessage = "I'm having trouble connecting right now. Please try again in a moment.";
  }

  res.status(statusCode).json({
    success: false,
    error: clientMessage,
  });
};
