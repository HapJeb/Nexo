import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, Project } from '../models/index.js'
import { config } from '../utils/config.js'
import { authenticate } from '../utils/middleware.js'

const router = Router()
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email).toLowerCase() })
  if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash)))
    return res.status(401).json({ error: 'El correo o la contraseña no coinciden.' })
  const token = jwt.sign({ id: user.id, name: user.name }, config.secret, { expiresIn: '8h' })
  res.json({ token, user: user.toJSON() })
})
router.get('/users', async (_req, res) => {
  const users = await User.find({}).sort({ _id: 1 })
  const projects = await Project.find({})
  res.json(
    users.map((user) => ({
      ...user.toJSON(),
      projectCount: projects.filter((project) =>
        project.members.some((member) => member.toString() === user.id),
      ).length,
    })),
  )
})
router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'Persona no encontrada.' })
  const projects = await Project.find({ members: user.id })
  res.json({ ...user.toJSON(), projects })
})
router.post('/users', authenticate, async (req, res) => {
  const { email, name, password, role } = req.body
  if (!password) return res.status(400).json({ error: 'La contraseña es obligatoria.' })
  if (String(password).length < 8)
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
  const passwordHash = await bcrypt.hash(password, 10)
  res.status(201).json(await User.create({ email, name, passwordHash, role }))
})
export default router
