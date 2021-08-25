const asyncHandler = require('express-async-handler')
const Job = require('../models/Job')

exports.getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find()

  res.json(jobs)
})

exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)

  if (!job) {
    res.status(404)
    throw new Error('Job not found on Job Finder')
  } else {
    res.json(job)
  }
})
