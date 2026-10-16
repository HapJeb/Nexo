import { connectDatabase, closeDatabase } from './db.js'
import { seed } from './seed.js'
import { User, Project, Task, Contact, Resource, Note } from './models/index.js'

if (process.env.MONGODB_URI && process.env.CONFIRM_RESET !== 'nexo')
  throw new Error('Establece CONFIRM_RESET=nexo para restablecer una base externa.')
await connectDatabase({autoIndex: false})
try {
  const duplicates = await Contact.aggregate([
    {
      $group: {
        _id: { $toLower: { $trim: '$email' } },
        count: { $sum: 1 },
        ids: { $push: '$_id' }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ])

  for (const { ids } of duplicates) {
    await Contact.deleteMany({ _id: { $in: ids.slice(1) } })
  }
} catch (error) {
  console.error('Error al eliminar duplicados:', error)
}
for (const model of [User, Project, Task, Contact, Resource, Note]) await model.deleteMany({})
await seed()
await closeDatabase()
console.log('El espacio Nexo está listo.')

