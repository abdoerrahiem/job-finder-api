const router = require('express').Router()
const {
  getMyNotifications,
  updateNotifications,
} = require('../controllers/notificationController')
const auth = require('../../middlewares/auth')

router.get('/', auth, getMyNotifications)
router.put('/:id', auth, updateNotifications)

module.exports = router
