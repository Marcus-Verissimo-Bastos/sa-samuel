import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
  const [type, token] = (req.headers.authorization || '').split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Faça login para continuar.' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: Number(payload.sub), role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Sessão inválida ou expirada. Entre novamente.' });
  }
}
