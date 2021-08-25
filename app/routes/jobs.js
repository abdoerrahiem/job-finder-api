const router = require('express').Router()
const { getJobs, getJob } = require('../controllers/JobController')

router.get('/', getJobs)
router.get('/:id', getJob)

module.exports = router
