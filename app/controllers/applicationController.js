const asyncHandler = require('express-async-handler')
const admin = require('firebase-admin')
const Application = require('../models/Application')
const Notification = require('../models/Notification')
const Job = require('../models/Job')
const { io } = require('../../server')
const serviceAccount = require('../../utils/admin.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

exports.createApplication = asyncHandler(async (req, res) => {
  const { phone, appLetter, location, resume, jobId, status } = req.body

  const application = await Application.create({
    user: req.user._id,
    phone,
    appLetter,
    location,
    resume,
    job: jobId,
    status,
  })

  const job = await Job.findById(jobId)

  await Notification.create({
    user: req.user._id,
    application: application._id,
    job: jobId,
    title: 'Application Sent',
    subtitle: `The application for ${job.title} has been sent to ${job.company} Company`,
    notificationType: 'application',
  })

  const payload = {
    data: {
      applicationId: `${application._id}`,
      type: 'application',
    },
    notification: {
      title: 'Application Sent',
      body: `Your application sent to ${job.company}`,
    },
  }

  const options = {
    priority: 'high',
  }

  setTimeout(() => {
    admin
      .messaging()
      .sendToDevice(req.user.notifToken, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response)
      })
      .catch((error) => {
        console.log('Error sending message:', error)
      })
  }, 5000)

  res.json(application)
})

exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ user: req.user._id })
    .populate('job')
    .sort({ createdAt: -1 })

  res.json(applications)

  io.on('connection', (socket) => {
    console.log('a user connected')
  })
})

exports.getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('job')

  if (!application) {
    res.status(404)
    throw new Error('Application not found on Job Finder')
  } else {
    res.json(application)
  }
})
