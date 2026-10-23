import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'voyentra-demo-secret-change-in-production';
const JWT_EXPIRES = '7d';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

/**
 * Express middleware — verifies the `Authorization: Bearer <token>` header.
 * Attaches `req.user = { id, email, name }` on success.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, email: payload.email, name: payload.name };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

/**
 * Optional auth — attaches req.user if a valid token is present, but
 * never rejects the request when the token is absent / invalid.
 */
export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.id, email: payload.email, name: payload.name };
    } catch {
      /* ignore */
    }
  }
  next();
}

export { JWT_SECRET };
