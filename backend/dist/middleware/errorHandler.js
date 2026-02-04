export function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
export function errorHandler(err, _req, res, _next) {
    const message = err instanceof Error ? err.message : String(err);
    const status = err?.status ?? 500;
    res.status(status).json({ error: message });
}
