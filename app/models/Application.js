const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    phone: { type: String, required: true },
    appLetter: { type: String, required: true },
    location: { type: String, required: true },
    resume: { type: String, required: true },
    job: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Job' },
    status: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Application', applicationSchema)
