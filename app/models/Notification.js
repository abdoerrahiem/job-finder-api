const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Application',
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    notificationType: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Notification', notificationSchema)
