import 'dotenv/config'
import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

export const dataDir = path.resolve('.data')
mkdirSync(dataDir, { recursive: true })
const secretFile = path.join(dataDir, 'session-key')
if (!process.env.JWT_SECRET && !existsSync(secretFile))
  writeFileSync(secretFile, randomBytes(48).toString('hex'), { mode: 0o600 })
export const config = {
  port: Number(process.env.PORT || 3001),
  host: process.env.HOST || '127.0.0.1',
  secret: process.env.JWT_SECRET || readFileSync(secretFile, 'utf8'),
  mongoUri: process.env.MONGODB_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:5173',
}
