export const initials = (name) =>
  (name || 'Nexo')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
export const money = (value) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value)
export const shortDate = (value) =>
  value
    ? new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(
        new Date(`${value}T12:00:00`),
      )
    : 'Sin fecha'
export const progress = (tasks) =>
  tasks.length
    ? Math.round((tasks.filter((task) => task.status === 'done').length / tasks.length) * 100)
    : 0
export const totalHours = (tasks) =>
  tasks.reduce((total, task) => {
    const hours = Number(task.estimate)
    if (!Number.isFinite(hours) || hours < 0) {
      throw new TypeError(`Invalid estimate: ${task.estimate}`)
    }
    return total + hours
  }, 0)
export const searchContacts = (contacts, search) => {
  const query = search.toLowerCase()
  return contacts.filter((contact) =>
    `${contact.name} ${contact.company} ${contact.email}`.toLowerCase().includes(query),
  )
}