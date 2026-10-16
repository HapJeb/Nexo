import { Router } from 'express'
import { Contact } from '../models/index.js'
import { authenticate } from '../utils/middleware.js'

const router = Router()
router.get('/', async (_req, res) => res.json(await Contact.find({})))
router.post('/', authenticate, async (req, res) => {
  const { name, company, email, phone } = req.body
  res.status(201).json(await Contact.create({ name, company, email, phone }))
})
router.patch('/:id', authenticate, async (req, res) => {
  const { company } = req.body
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { company },
    { new: true, runValidators: true },
  )
  if (!contact) return res.status(404).json({ error: 'Contacto no encontrado.' })
  res.json(contact)
})
router.delete('/:id', authenticate, async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id)
  if (!contact) return res.status(404).json({ error: 'Contacto no encontrado.' })
  res.status(204).end()
})
export default router
