const mongoose = require('mongoose')
const Job = require('../app/models/Job')
const data = require('./data.json')

mongoose.connect(
  'mongodb+srv://abdoerrahiem:abdoerrahiem@jobfinder.senkv.mongodb.net/jobfinder?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
)

const seederJob = async () => {
  try {
    await Job.deleteMany()
    console.log('Jobs Deleted')

    await Job.insertMany(data)
    console.log('Jobs added.')

    process.exit()
  } catch (err) {
    console.log(err.message)
    process.exit()
  }
}

seederJob()
