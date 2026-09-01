/**
 * apiKey.js
 * -----------------------------------------------------------------------
 * Valida que el request traiga el header X-Api-Key esperado. Este key es
 * el mismo que está hardcodeado en el cliente (src/services/api.ts), así
 * que en un pentest real este check no protege nada — cualquiera puede
 * extraer la key del bundle y llamar al backend directamente. Se incluye
 * acá solo para que el flujo end-to-end sea fiel a ese patrón vulnerable.
 * -----------------------------------------------------------------------
 */
function requireApiKey(req, res, next) {
  const key = req.header('X-Api-Key');
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}

module.exports = { requireApiKey };
