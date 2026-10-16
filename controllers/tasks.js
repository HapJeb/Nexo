import { Router } from 'express'
import { Task } from '../models/index.js'
import { authenticate } from '../utils/middleware.js'

const router = Router()
router.get('/', async (req, res) =>
  res.json(
    await Task.find(req.query.project ? { project: req.query.project } : {}).populate(
      'assignee',
      'name color',
    ),
  ),
)
router.post('/', authenticate, async (req, res) => {
  const { title, project, priority, estimate, dueDate } = req.body
  const task = await Task.create({
    title,
    project,
    priority,
    estimate,
    dueDate,
    assignee: req.user.id,
  })
  res.status(201).json(await task.populate('assignee', 'name color'))
})
router.patch('/:id', authenticate, async (req, res) => {
  const { status, title, priority } = req.body
  const changes = Object.fromEntries(
    Object.entries({ status, title, priority }).filter(([, value]) => value !== undefined),
  )
  const task = await Task.findByIdAndUpdate(req.params.id, changes, {
    new: true,
    runValidators: true,
  }).populate('assignee', 'name color')
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada.' })
  res.json(task)
})
export default router
