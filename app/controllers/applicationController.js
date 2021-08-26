const asyncHandler = require('express-async-handler')
const admin = require('firebase-admin')
const Application = require('../models/Application')
const Notification = require('../models/Notification')
const User = require('../models/User')
const Job = require('../models/Job')
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

exports.updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)

  if (!application) {
    res.status(404)
    throw new Error('Application not found on Job Finder')
  } else {
    const user = await User.findById(application.user)
    const job = await Job.findById(application.job)

    application.status = req.body.status
    application.save()

    const subtitle =
      req.body.status === 'not-suitable'
        ? `We are sorry but the application you sent to ${job.company} has been rejected by the company`
        : req.body.status === 'interview'
        ? `Congratulations! Your application has been approved by ${job.company}`
        : ''

    await Notification.create({
      user: application.user,
      application: application._id,
      job: application.job,
      title: `Application ${
        req.body.status === 'not-suitable'
          ? 'Rejected'
          : req.body.status === 'interview'
          ? 'Approved'
          : ''
      }`,
      subtitle,
      notificationType: 'application',
    })

    const body =
      req.body.status === 'not-suitable'
        ? `Your application rejected by ${job.company}`
        : req.body.status === 'interview'
        ? `Congratulations! Your application accepted by ${job.company}`
        : ''

    const payload = {
      data: {
        applicationId: `${application._id}`,
        type: 'application',
      },
      notification: {
        title: `Application ${
          req.body.status === 'not-suitable'
            ? 'Rejected'
            : req.body.status === 'interview'
            ? 'Approved'
            : ''
        }`,
        body,
      },
    }

    const options = {
      priority: 'high',
    }

    admin
      .messaging()
      .sendToDevice(user.notifToken, payload, options)
      .then((response) => {
        console.log('Successfully sent message:', response)
      })
      .catch((error) => {
        console.log('Error sending message:', error)
      })

    res.json(application)
  }
})
