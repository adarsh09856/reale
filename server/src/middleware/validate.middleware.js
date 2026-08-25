export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      req.validated = parsed;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: err.errors ? err.errors.map(e => ({ path: e.path.join('.'), message: e.message })) : err.message
      });
    }
  };
};
