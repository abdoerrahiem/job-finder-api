const asyncHandler = require('express-async-handler')
const Message = require('../models/Message')

exports.createMessage = asyncHandler(async (req, res) => {
  const message = await Message.create({
    conversation: req.params.conversationId,
    sender: req.user._id,
    receiver: req.body.receiver,
    text: req.body.text,
  })

  res.json(message)
})

exports.getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    conversation: req.params.conversationId,
  })

  res.json(messages)
})
