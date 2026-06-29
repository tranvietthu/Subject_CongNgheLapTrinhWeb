export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (err?.name === 'ZodError') {
    return res.status(400).json({ message: 'Validation error', issues: err.errors });
  }
  if (err?.code === 'P2025') {
    return res.status(404).json({ message: 'Resource not found' });
  }
  if (err?.code === 'P2002') {
    return res.status(409).json({ message: 'Duplicate data', fields: err.meta?.target });
  }
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  if (status === 500) console.error(err);
  res.status(status).json({ message });
}
