function badRequest(res, msg){
  return res.status(400).json({ error: msg });
}

function isEmail(v){
  return typeof v === 'string' && /\S+@\S+\.\S+/.test(v);
}

function isDateString(v){
  if (!v) return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
}

// schema: { field: { required?:bool, type?:'string'|'email'|'date'|'number', minLength?:n, maxLength?:n } }
function validateBody(schema){
  return (req, res, next) => {
    const body = req.body || {};
    for (const field of Object.keys(schema)){
      const cfg = schema[field];
      const val = body[field];
      if (cfg.required && (val === undefined || val === null || (typeof val === 'string' && val.trim()===''))) {
        return badRequest(res, `${field} is required`);
      }
      if (val === undefined || val === null) continue;
      if (cfg.type === 'email' && !isEmail(val)) return badRequest(res, `${field} must be a valid email`);
      if (cfg.type === 'date' && !isDateString(val)) return badRequest(res, `${field} must be a valid date`);
      if (cfg.type === 'number' && isNaN(Number(val))) return badRequest(res, `${field} must be a number`);
      if (cfg.minLength && String(val).trim().length < cfg.minLength) return badRequest(res, `${field} must be at least ${cfg.minLength} characters`);
      if (cfg.maxLength && String(val).length > cfg.maxLength) return badRequest(res, `${field} must be at most ${cfg.maxLength} characters`);
    }
    next();
  }
}

module.exports = { validateBody };
