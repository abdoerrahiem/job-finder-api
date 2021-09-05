const router = require('express').Router()
const {
  createApplication,
  getMyApplications,
  getApplication,
  updateApplication,
  test,
} = require('../controllers/applicationController')
const auth = require('../../middlewares/auth')

router.post('/', auth, createApplication)
router.get('/', auth, getMyApplications)
router.get('/:id', getApplication)
router.put('/:id', auth, updateApplication)
router.post('/test', test)

module.exports = router
