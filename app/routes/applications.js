const router = require('express').Router()
const {
  createApplication,
  getMyApplications,
  getApplication,
  updateApplication,
} = require('../controllers/applicationController')
const auth = require('../../middlewares/auth')

router.post('/', auth, createApplication)
router.get('/', auth, getMyApplications)
router.get('/:id', getApplication)
router.put('/:id', auth, updateApplication)

module.exports = router
