const router = require('express').Router()
const {
  registeUser,
  sendOtp,
  verifyUser,
  loginUser,
  updateName,
  updateBirthdate,
  updateEmail,
  updatePassword,
  updatePhoto,
  removeNotifToken,
  payment,
  updateStatusUser,
  updatePremiumUser,
  getCurrentUser,
} = require('../controllers/userController')
const auth = require('../../middlewares/auth')

router.post('/register', registeUser)
router.post('/otp', sendOtp)
router.post('/verify', verifyUser)
router.post('/login', loginUser)
router.put('/update/name', auth, updateName)
router.put('/update/birthdate', auth, updateBirthdate)
router.put('/update/email', auth, updateEmail)
router.put('/update/password', auth, updatePassword)
router.put('/update/photo', auth, updatePhoto)
router.put('/update/token', auth, removeNotifToken)
router.post('/payment', auth, payment)
router.put('/update/status', auth, updateStatusUser)
router.put('/update/premium', auth, updatePremiumUser)
router.get('/me', auth, getCurrentUser)

module.exports = router
