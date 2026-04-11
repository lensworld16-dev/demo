export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV !== 'production';
  
  // Always log error to server console
  console.error('❌ API Error:', err);

  const message = (err.isOperational || isDev) ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDev && { 
      stack: err.stack,
      detail: err.detail,
      hint: err.hint,
      code: err.code
    }),
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
}
