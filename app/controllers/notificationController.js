const asyncHandler = require('express-async-handler')
const Notification = require('../models/Notification')

exports.getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  })
    .populate('job')
    .sort({ createdAt: -1 })

  res.json(notifications)
})

exports.updateNotifications = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id)

  if (notification) {
    notification.isRead = true
    notification.save()

    res.json(notification)
  } else {
    res.status(404)
    throw new Error('Notification not found on Job Finder')
  }
})
