import { Router } from 'express'
import { Resource, Note } from '../models/index.js'
import { authenticate } from '../utils/middleware.js'

const router = Router()
router.get('/resources', async (req, res) =>
  res.json(
    await Resource.find(req.query.tag ? { tag: req.query.tag } : {}).populate(
      'author',
      'name color',
    ),
  ),
)
router.post('/resources', authenticate, async (req, res) => {
  const { title, url, description, tag } = req.body
  res.status(201).json(await Resource.create({ title, url, description, tag, author: req.user.id }))
})
router.post('/resources/:id/like', authenticate, async (req, res) => {
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true },
  )
  if (!resource) return res.status(404).json({ error: 'Recurso no encontrado.' })
  res.json(resource)
})
router.get('/notes', async (_req, res) =>
  res.json(await Note.find({}).sort({ createdAt: -1 }).populate('author', 'name color')),
)
router.post('/notes', authenticate, async (req, res) =>
  res.status(201).json(await Note.create({ content: req.body.content, author: req.user.id })),
)
export default router
