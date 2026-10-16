import jwt from 'jsonwebtoken'
import { config } from './config.js'

export function authenticate(req, res, next) {
  const authorization = req.get('authorization') || ''
  if (!authorization.startsWith('Bearer '))
    return res.status(401).json({ error: 'Inicia sesión para continuar.' })
  try {
    req.user = jwt.verify(authorization.slice(7), config.secret)
    next()
  } catch {
    res.status(401).json({ error: 'Tu sesión expiró. Vuelve a iniciar sesión.' })
  }
}
export function errorHandler(error, _req, res, _next) {
  if (error.name === 'CastError') return res.status(400).json({ error: 'Identificador no válido.' })
  if (error.name === 'ValidationError') return res.status(400).json({ error: error.message })
  if (error.code === 11000)
    return res.status(409).json({ error: 'Este correo ya está registrado.' })
  console.error(error.name, error.message)
  res.status(500).json({ error: 'No se pudo completar la operación.' })
}
