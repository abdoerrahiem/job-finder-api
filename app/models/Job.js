const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    positions: [{ position: { type: String, required: true } }],
    company: { type: String, required: true },
    salary: { type: Number, required: true },
    companyDescription: { type: String, required: true },
    requirements: [{ requirement: { type: String, required: true } }],
    jobDescriptions: [{ jobDescription: { type: String, required: true } }],
    skills: [{ skill: { type: String, required: true } }],
    isFreelance: { type: Boolean },
    isNewer: { type: Boolean },
    image: { type: String, required: true },
    experience: { type: String, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Job', jobSchema)
