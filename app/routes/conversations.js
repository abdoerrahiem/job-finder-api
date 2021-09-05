const router = require('express').Router()
const {
  createConversation,
  getMyConversations,
} = require('../controllers/conversationController')
const auth = require('../../middlewares/auth')

router.post('/', auth, createConversation)
router.get('/me', auth, getMyConversations)

module.exports = router
