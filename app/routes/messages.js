const router = require('express').Router()
const {
  createMessage,
  getMessages,
} = require('../controllers/messageController')
const auth = require('../../middlewares/auth')

router.post('/:conversationId', auth, createMessage)
router.get('/:conversationId', auth, getMessages)

module.exports = router
