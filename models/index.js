import mongoose from 'mongoose'

const { Schema, model } = mongoose
function serialize(_doc, object) {
  object.id = object._id.toString()
  delete object._id
  delete object.__v
  delete object.passwordHash
}
const options = { timestamps: true, toJSON: { transform: serialize } }
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'Diseño de producto' },
    color: { type: String, default: 'purple' },
  },
  options,
)
const projectSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 80 },
    description: { type: String, default: '' },
    client: { type: String, default: 'Estudio Norte' },
    color: { type: String, default: 'purple' },
    status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
    budget: { type: Number, min: 0, default: 12000 },
    dueDate: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  options,
)
const taskSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignee: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['todo', 'doing', 'done'], default: 'todo' },
    priority: { type: String, enum: ['Alta', 'Media', 'Baja'], default: 'Media' },
    estimate: { type: String, default: '2' },
    dueDate: String,
  },
  options,
)
const contactSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    company: { type: String, default: '' },
    email: { type: String, required: true, trim:true, unique: true, match: /.+@.+\..+/ },
    phone: String,
  },
  options,
)
const resourceSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 3 },
    url: { type: String, required: true },
    description: String,
    tag: { type: String, default: 'Diseño' },
    likes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  options,
)
const noteSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  options,
)
export const User = model('User', userSchema)
export const Project = model('Project', projectSchema)
export const Task = model('Task', taskSchema)
export const Contact = model('Contact', contactSchema)
export const Resource = model('Resource', resourceSchema)
export const Note = model('Note', noteSchema)
